// TODO: page load hangs if we use import aliases (e.g. #)
// https://github.com/AnalogStudiosRI/www.analogstudiosri.com/issues/25
import { getPosts } from "../../services/posts.ts";
import type { Post } from "../../services/posts.ts";
import { formatDateTime } from "../../services/util.ts";
import postsListSheet from "./posts-list.css" with { type: "css" };
import themeSheet from "../../styles/theme.css" with { type: "css" };
export default class PostsListComponent extends HTMLElement {
  #posts: Post[] = [];
  #max = 0;

  async connectedCallback() {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.#posts = (await getPosts()).reverse();
    this.#max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")!, 10) : 0;

    this?.shadowRoot?.adoptedStyleSheets.push(themeSheet, postsListSheet);
    this.render();
  }

  render() {
    const maxDisplay = !this.#max ? this.#posts.length : this.#max;
    const maxPosts = this.#posts.slice(0, maxDisplay);
    const html = maxPosts
      .map((post) => {
        const formattedDate = formatDateTime(post.createdTime);

        return `
        <div class="post">
          <div class="post__time">Posted: ${formattedDate}</div>

          <h4 class="post__heading">${post.title}</h4>

          <details class="post__summary">${post.summary}</details>
        </div>
      `;
      })
      .join("");

    return (
      <div class="as-posts-list">
        <h3 class="as-posts-list__heading">Latest Posts</h3>
        <div class="posts">{html}</div>
      </div>
    );
  }
}

customElements.define("as-posts-list", PostsListComponent);
