if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
const CONTENT = "savedElements";
const elementFactory = new ElementFactory();
PetiteVue.createApp({
  message: "Welcome",
  dialog: null,
  copied: null,
  resetClicks: 0,
  resetBtnTexts: ["New", "Sure?", "Pew!"],
  elements: elementFactory.initElements(),
  selected: null,
  selectedWord: null,
  addPoint: 0,
  addToolLocation: null,
  sortLocal: false,
  pasteFailContent: "",
  importing: false,
  importContent: "",
  mounted() {
    console.log("mounted");
    // Load from LS
    const json = window.localStorage.getItem(CONTENT);
    if (json) {
      const saved = JSON.parse(json);
      if (saved && Array.isArray(saved)) {
        this.elements = saved;
      }
    }
    this.addPoint = this.nextOrdinal();
  },
  // Computed
  maxOrdinal() {
    const max = Math.max(...this.elements.map((e) => e.order)) || 0;
    return max;
  },
  nextOrdinal() {
    const max = Math.max(...this.elements.map((e) => e.order)) || 0;
    console.log("nextOrdinal", max + 1);
    return max + 1;
  },
  orderedElements() {
    return this.elements.sort((a, b) => a.order - b.order);
  },
  allVocab() {
    const all = [...this.elements].flatMap((e) => e.words);
    const allWords = all.filter((e) => e.foreign > "");
    const allUsages = all.filter((e) => e.phrase > "");
    if (this.sortLocal) allWords.sort((a, b) => a.local.localeCompare(b.local));
    else allWords.sort((a, b) => a.foreign.localeCompare(b.foreign));

    allWords.forEach((w) => {
      w.usages = allUsages.filter(
        (u) => u.phrase.search(new RegExp(w.foreign, "i")) !== -1
      );
    });
    return allWords;
  },
  isSel(element) {
    return element.id === this.selected;
  },
  showTools(element) {
    const isOpenOnElement =
      this.addToolLocation === "ELEMENT" &&
      this.isSel(element) &&
      this.addPoint === element.order;
    const isOpenAtEnd =
      this.addToolLocation === "END" && element.order === this.maxOrdinal();
    return isOpenOnElement || isOpenAtEnd;
  },
  // Methods
  select(element, word) {
    const prevSelected = this.selected;
    this.selected = element.id;
    if (word) this.selectedWord = word.id;
    if (this.selected !== prevSelected) this.hideElementTools();
  },
  hideElementTools() {
    if (this.addToolLocation === "ELEMENT") this.addToolLocation = null;
    console.log("hideElementTools", this.addToolLocation, this.addPoint);
  },
  toggleTools(element) {
    const toolLocationTarget = element ? "ELEMENT" : "END";
    this.addPoint = element ? element.order : this.nextOrdinal();
    this.addToolLocation =
      this.addToolLocation === toolLocationTarget ? null : toolLocationTarget;
    console.log("toggleTools", this.addToolLocation, this.addPoint);
  },
  add(elementType) {
    const order =
      this.addToolLocation === "END" ? this.maxOrdinal() : this.addPoint;

    // Shunt down existing elements
    const newOrdinal = order + 1;
    this.elements
      .filter((e) => e.order >= newOrdinal)
      .forEach((e) => (e.order += 1));

    // Add new element
    const newEl = elementFactory.createElement(
      elementType || elementFactory.gloss,
      newOrdinal
    );
    this.elements.push(newEl);
    console.log("add", order, elementType);
    this.save();
  },
  remove(element) {
    const removeIndex = this.elements.findIndex((e) => e.id === element.id);
    console.log("remove removeIndex", removeIndex, this.elements);
    this.elements.splice(removeIndex, 1);
    // Renumber elements to remove ordinal gaps
    this.elements
      .sort((a, b) => a.order - b.order)
      .forEach((el, index) => {
        el.order = index;
      });
    this.save();
  },
  addWord(element) {
    const newWord = elementFactory.createWord();
    element.words.push(newWord);
    this.select(element, newWord);
    this.save();
  },
  removeWord(element, wordId) {
    const removeIndex = element.words.findIndex((w) => w.id === wordId);
    console.log("removeWord removeIndex", removeIndex, element.words);
    element.words.splice(removeIndex, 1);
    this.save();
  },
  moveUp(element) {
    const newOrder = element.order - 1;
    const swapElement = this.elements.find((e) => e.order === newOrder);
    if (swapElement) swapElement.order += 1;
    element.order = newOrder;
  },
  moveDown(element) {
    const newOrder = element.order + 1;
    const swapElement = this.elements.find((e) => e.order === newOrder);
    if (swapElement) swapElement.order -= 1;
    element.order = newOrder;
  },
  reset() {
    var vm = this;
    this.resetClicks++;
    if (this.resetClicks === 2) {
      this.elements = elementFactory.initElements();
      this.save();
      setTimeout(function () {
        vm.resetClicks = 0;
      }, 1000);
    }
    if (this.resetClicks > 2) this.resetClicks = 0;
  },
  blur() {
    this.save();
  },
  save() {
    console.log("Save");
    this.resetClicks = 0;
    // Save to LS
    const json = JSON.stringify(this.elements);
    window.localStorage.setItem(CONTENT, json);
  },
  copy(content, label) {
    try {
      navigator.clipboard.writeText(content);
      this.copied = label;
      window.setTimeout(() => (this.copied = null), 1000);
    } catch (e) {
      this.pasteFailContent = content;
      this.copied = false;
    }
  },
  copyText() {
    const allLinesContent = this.elements
      .map((e) => elementFactory.elementString(e))
      .join("\r\n");
    this.copy(allLinesContent, "TEXT");
  },
  copyVocab() {
    const allVocabContent = this.allVocab()
      .map((w) => elementFactory.vocabString(w))
      .join("\r\n");
    this.copy(allVocabContent, "VOCAB");
  },
  copyJson() {
    const json = JSON.stringify(this.elements);
    this.copy(json, "JSON");
  },
  load() {
    this.elements = JSON.parse(this.importContent);
    this.importing = false;
    this.importContent = "";
  },
}).mount();
