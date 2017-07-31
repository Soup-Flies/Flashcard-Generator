class ClozeCard {
  constructor(text, ans) {
    this.fullText = text;
    this.ans = ans;
    this.text = this.fullText.replace(this.ans, " ... ");
  }
}
module.exports = ClozeCard;
