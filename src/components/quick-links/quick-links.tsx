declare global {
  namespace JSX {
    interface IntrinsicElements {
      'as-quick-links': {
        options: Option[]
      };
    }
  }
}

interface Option {
  id: string,
  value: string,
  route: string,
}

// TODO: would be nice to do this without JavaScript
export default class QuickLinks extends HTMLElement {
  options: Option[] = [];

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') ?? '[]');

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  }

  // TODO: figure out why this is not working and enable the feature
  selectOption(event: Event) {
    console.log('selected link', event);
    // const selectedLink = this.options.find(link => link.id === (event.target as HTMLSelectElement).value);
    // if (selectedLink) {
    //   window.location.href = `${this.baseRoute}/${selectedLink.id}/`;
    // }
  }

  render() {
    const { options } = this;
    const optionsListHtml = [{ id: "default", value: "Select Option" }, ...options].map(link => {
      return `<option value="${link.id}">${link.value}</option>`;
    }).join('\n');

    return (
      <select name="quick-links-dropdown" onchange={this.selectOption}>
        {optionsListHtml}
      </select>
    )
  }
}

customElements.define('as-quick-links', QuickLinks);