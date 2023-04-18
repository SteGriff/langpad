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
}