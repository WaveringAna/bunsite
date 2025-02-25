---
author: waveringana
date: 2025-02-25
title: Bun the Bundler
excerpt: As fast as a bunny. As annoying to maintain as a bunny.
---

When Bun shipped its direct HTML/React bundling as a feature, I immediately bounced to play around with it and created this site with it. It made using React fun again as NextJS and RSCs made me hate it with strong fervor. 

Serving up a SPA now with a competent backend now is as simple as

```typescript
import index from "./public/index.html";
import { serve } from "bun";

serve({
    routes: {
        "/*": index,
    },
})
```

```html
<!DOCTYPE html>
<html>

<body>
    <div id="root"></div>
    <script type="module" src="../frontend.tsx"></script>
</body>

</html>
```

and the react root:

```typescript
import "./styles/index.css";
import { createRoot } from "react-dom/client";
import Home from "./pages/index.tsx";

document.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(rootElement);
    root.render(<Home />);
});
```

Everything gets bundled well, and there's no build steps whatsoever! I can write my components, add some backend routes, and its all so quick to make and deploy.

From here though I quickly discovered problems with being at the bleeding edge, broken features and just wrong documentation.

One of which is the tailwind bundling; the parser just doesn't work? The docs tell you just add the plugin to `bunfig.toml` (lovely name btw) then import it to the css, and it'll bundle, which it does.

But its unparsed css where nothing gets applied.

![](/public/brokenTailwind.png)

The tailwind css makes it to the browser, but only my own css gets applied and parsed. For the life of me I cannot figure out why it does not work. [Theo ran into the issue too on his video about Bun the Bundler](https://www.youtube.com/watch?v=Y5JrsqBt7sI) (minute 17), and it still hasn't been fixed as of this writing

There is a seperate issue (even bigger) to this where [the npm repository for the bun-plugin-tailwind package](https://www.npmjs.com/package/bun-plugin-tailwind) does not even point to the correct code repository but instead to tailwind's repo which is borderline dangerous. I cannot find where the true repo is (if its even hosted publically outside NPM lol)

I resorted to using the tailwindcss cli which introduces a build step back into my site, something I wanted to avoid!

I wanted to make my own plugin to directly import Markdown files that can be loaded into HTML which the docs make it seem like I can easily do. 

```typescript
/** https://bun.sh/docs/bundler/loaders */
type Loader =
	| "js"
	| "jsx"
	| "ts"
	| "tsx"
	| "json"
	| "toml"
	| "file"
	| "napi"
	| "wasm"
	| "text"
	| "css"
	| "html";
```

shows that HTML is a valid loader to use

I followed [https://bun.sh/docs/bundler/plugins](https://bun.sh/docs/bundler/plugins) to create a plugin for this 

```typescript
await plugin({
    name: "markdown",
    setup(build) {
        build.onLoad({ filter: /\.md$/ }, async (args) => {
            const text = await Bun.file(args.path).text();
            const processor = unified()
                .use(remarkParse)
                .use(remarkRehype)
            const result = await processor.process(text);

            console.log("Markdown processed");
            return {
                contents: result.toString(),
                loader: "html",
            };
        })
    }
});
```

andddddd

`error: Expected loader to be one of "js", "jsx", "object", "ts", "tsx", "toml", or "json"`

Bummer. The cool thing NextJS brought back to the react world is SSR. Bun is working to have that be easy to make which I was excited for, and yet I'm unable to extend their SSR to parse markdown on my server and instead force the client to do it which is what you're looking at right now. Sorry if you have shit hardware and it took a bit to render.

I still wish to express my excitement again though. I haven't had this much fun writing pure React by hand since MERN was every single job posting on Linkedin. (Or NextJS 13, I miss you) The Bun team did great work shipping this. These are minor things really, but I wanted to document the issues I ran into while experimenting with it.