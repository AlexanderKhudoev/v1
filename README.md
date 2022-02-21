<div align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/AlexanderKhudoev/v1/master/src/images/logo.png" width="100" />
</div>
<h1 align="center">
  khudoev.dev - v1
</h1>
<p align="center">
  The first iteration of <a href="https://khudoev.dev" target="_blank">khudoev.dev</a> built with <a href="https://www.gatsbyjs.org/" target="_blank">Gatsby</a>
</p>

![demo](https://raw.githubusercontent.com/AlexanderKhudoev/v1/master/src/images/demo.png)

## 🚨 Forking this repo (please read!)

Many people have contacted me asking me if they can use this code for their own website, and the answer to that question is usually **yes, with attribution**.

I value keeping my site open source, but as you all know, _**plagiarism is bad**_. It's always disheartening whenever I find that someone has copied my site without giving me credit. I spent a non-trivial amount of effort building and designing this iteration of my website, and I am proud of it! All I ask of you all is to not claim this effort as your own.

Please also note that I did not build this site with the intention of it being a starter theme, so if you have questions about implementation, please refer to the [Gatsby docs](https://www.gatsbyjs.org/docs/).

### TL;DR

Yes, you can fork this repo. <br/>
Please give me proper credit by linking back to [khudoev.dev](https://khudoev.dev). <br/>
Thanks!

## 💠 Features

- Automatic Table of Contents (ToC) generation inside \*.md
- [Youtube Embedded Video](https://github.com/AlexanderKhudoev/gatsby-remark-embed-video) inside \*.md with additional options
- Python syntax highlighting
- LaTeX (katex) formula rendering support

Check the `/blog/posts/markdown-playground` link after Gatsby `start` for features demo.

## 🛠 Installation & Set Up

1. Install the Gatsby CLI

   ```sh
   npm install -g gatsby-cli
   ```

2. Install and use the correct version of Node using [NVM](https://github.com/nvm-sh/nvm)

   ```sh
   nvm install
   ```

3. Install dependencies

   ```sh
   yarn
   ```

4. Start the development server

   ```sh
   npm start
   ```

## 🚀 Building and Running for Production

1. Generate a full static production build

   ```sh
   npm run build
   ```

1. Preview the site as it will appear once deployed

   ```sh
   npm run serve
   ```

## 🎨 Color Reference

| Color          | Hex                                                                |
| -------------- | ------------------------------------------------------------------ |
| Navy           | ![#001935](https://via.placeholder.com/10/001935?text=+) `#001935` |
| Light Navy     | ![#5a189a](https://via.placeholder.com/10/5a189a?text=+) `#5a189a` |
| Lightest Navy  | ![#7b2cbf](https://via.placeholder.com/10/7b2cbf?text=+) `#7b2cbf` |
| Slate          | ![#8892b0](https://via.placeholder.com/10/8892b0?text=+) `#8892b0` |
| Light Slate    | ![#a8b2d1](https://via.placeholder.com/10/a8b2d1?text=+) `#a8b2d1` |
| Lightest Slate | ![#ccd6f6](https://via.placeholder.com/10/ccd6f6?text=+) `#ccd6f6` |
| White          | ![#e6f1ff](https://via.placeholder.com/10/e6f1ff?text=+) `#e6f1ff` |
| Green          | ![#64ffda](https://via.placeholder.com/10/64ffda?text=+) `#64ffda` |

## 📌 Troubleshooting

Most build problems can be caused by the wrong `node_modules` folder,
so to solve problems, I recommend running these commands and actions:

1. `npm cache clean --force`
2. delete `node_modules` folder
3. delete `yarn-lock.json` file
4. `yarn install`

Also, if you have some errors, try to kill all node.exe processes via Task Manager, and reopen the IDE.

## P.S.

The core of this project and design was developed by [Brittany Chiang](https://brittanychiang.com/). <br/>
I filled and improved this template with all sorts of features.
