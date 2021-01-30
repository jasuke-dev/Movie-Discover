class SwitchColor extends HTMLElement{
    render(){
        this.innerHTML = `
        <span></span>
        `;
    }
}
customElements.define("switch-color", SwitchColor);