import { visit } from "unist-util-visit";
import type { Root } from 'mdast';

function removeCodeTrail() {
	return (tree: Root) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "pre") {
				for (const inner of node.children) {
					if (inner.tagName !== "code") continue;

					const last = inner.children.length - 1;
					if (last < 0) return;

					if (!inner.children[last].children?.length) {
						inner.children.splice(last, 1);
					}
				}
			}
		});
	}
}

export { removeCodeTrail };
