class BigAssButton extends HTMLElement {

  constructor() {
    super();

    this.assignAttributesOrDefaultsToThis();
    this.render();
  }

  assignAttributesOrDefaultsToThis() {
    this.isRound = this.hasAttribute("round");
    this.lift = this.getAttribute("lift") || 10;
    this.dropDepth = this.getAttribute("dropDepth") || 1;
    this.color = this.getAttribute("color") || "#fff";
    this.backgroundColor = this.getAttribute("backgroundColor") || "#A82322";
    this.dropColor = this.getAttribute("dropColor") || "#851C1B";
    this.secondaryDropColor =
      this.getAttribute("secondaryDropColor") || "#521111";

    const soundUrl =
      this.getAttribute("sound") ||
      "http://www.realmofdarkness.net/audio/vg/mario/sm64/mario/waha.mp3";
    this.sound = new Audio(soundUrl);
  }

  /**
   * Creates DOM like
   * 
   * #shadow-root 
   *  <span>
   *    <style>...</style>
   *    <button>
   *      <slot></slot>
   *    </button>
   *  </span>
   * #shadow-root
   */
  render() {
    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("span");
    const style = document.createElement("style");
    style.textContent = this.getStyle();
    const button = document.createElement("button");
    const slot = document.createElement("slot");

    button.addEventListener("click", () => {
      this.sound.currentTime = 0;
      this.sound.play()
    });

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(button);
    button.appendChild(slot);
  }

  getStyle() {
    // How far button should shift over
    const pressDepth = this.lift - this.dropDepth;
    const roundCssProps = !this.isRound ? "" : `
      height: 300px;
      width: 300px;
      border-radius: 50%;
    `;

    return `
      span {
        position: relative;
      }

      button {
        background-color: ${this.backgroundColor};
        color: ${this.color};
        font-family: "Gill Sans", sans-serif;
        font-size: 30px;
        font-weight: bold;
        position: relative;
        top: 0;
        left: 0;
        padding: 1em 2em;
        border: none;
        box-shadow: ${this.getBoxShadowRows(this.lift)}
        ${roundCssProps}
        outline: none;
        transition: all 50ms linear;
      }

      button:active {
        left: ${pressDepth}px;
        top: ${pressDepth}px;
        box-shadow: ${this.getBoxShadowRows(this.dropDepth)}
      }
    `;
  }

  getBoxShadowRows(height) {
    if (height === 0) return "none";

    let rows = ``;

    for (let i = 0; i < height; i++) {
      rows += `
        ${i}px ${i + 1}px 0px ${this.dropColor},
        ${i + 1}px ${i}px 0px ${this.secondaryDropColor},  
      `;
    }

    return rows + `${height}px ${height}px 0px ${this.dropColor};`; // add final row
  }
}

// define new element on Window.customElements
customElements.define("big-ass-button", BigAssButton);
