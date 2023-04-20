var ElementFactory = function () {
    this.ab = "ab";
    this.gloss = "gloss";
    this.mnem = "mnem";
    this.usage = "usage";
    this.h1 = "h1";

    this.createElement = function (elementType, order, local, foreign) {
        const el = {
            "id": cuid(),
            "elementType": elementType,
            "order": order,
            "alignment": 0,
            "words": [this.createWord(local, foreign)]
        }
        console.log("createElement", el);
        return el;
    }

    this.createWord = function (local, foreign) {
        return {
            "id" : cuid(),
            "local": local || "",
            "foreign": foreign || "",
            "phrase" : "",
        }
    }

    this.initElements = function () {
        return [
            this.createElement(this.h1, 0, "Greetings"),
            this.createElement(this.gloss, 1, "Hello", "Hola")
        ]
    }

    this.elementString = function(element) {
        return element.words
            .flatMap(w => this.wordString(w))
            .join('\r\n');
    }

    this.wordString = function(word) {
        const def = word.local 
            ? ` - ${word.local}`
            : '';

        if (word.phrase)
            return `${word.phrase}${def}`;

        if (word.foreign)
            return `${word.foreign}${def}`;

        return word.local;
    }

    this.vocabString = function(word) {
        const baseString = this.wordString(word);
        if (word.usages) { 
          const usageStrings = word.usages.map(u => u.phrase).join('\r\n');
          return [baseString, usageStrings].join('\r\n');
        }
        return baseString;
    }
}