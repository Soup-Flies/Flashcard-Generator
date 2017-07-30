class ClozeCard {
  constructor(text, cloze) {
    this.fullText = text;
    this.cloze = cloze;
    this.partial = this.fullText.replace(this.cloze, " ... ");
  }
}
module.exports = ClozeCard;
