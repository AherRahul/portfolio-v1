---
title: "How I Setup my Terminal for Ultimate Productivity"
description: "One of the first things I do after getting a new laptop or joining a new company is setting up my terminal."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/setup-terminal-for-productivity.md"
dateModified: "2024-04-07"
datePublished: "2024-04-07"
showOnArticles: true
topics:
  - productivity
---

One of the first things I do after getting a new laptop or joining a new company is  **setting up my terminal** .

Until about 4 years ago, I just used the default terminal, but I soon realized I was missing out on a much better experience.

Setting up my terminal with the tools I’m about to share in this article significantly boosted my productivity as a Software Developer.

It allows me to do more by typing less, and I never have to worry about remembering commands I use frequently.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/ad80f55a-f758-4fe4-9146-6dffb8fed5dc_3342x2002.png)](https://substackcdn.com/image/fetch/$s_!YET5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fad80f55a-f758-4fe4-9146-6dffb8fed5dc_3342x2002.png)

In this article, I'll provide a step-by-step guide on how to supercharge your terminal experience.

**Note:**  These tools work best with macOS/Linux, but you can find alternatives for Windows.

## 1. Install Homebrew

[Homebrew](https://brew.sh/) allows you to install / update a wide range of software packages and tools using simple terminal commands like:

brew install package-name

It simplifies the process of installing and managing software packages on macOS and Linux systems.

Run the following command to install it:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 2. Make Zsh the default shell (if not already)

Latest version of macOS uses Zsh (Z shell) as the default shell instead of Bash.

If it’s not the default, you can set it as default using the below command:

```
chsh -s $(which zsh)
```

## 3. Install Warp Terminal

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e154ab04-e8d4-4b60-b10b-7a02177f1930_2744x1856.png)](https://substackcdn.com/image/fetch/$s_!6IYX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe154ab04-e8d4-4b60-b10b-7a02177f1930_2744x1856.png)

I recently switched from [iTerm2](https://iterm2.com/) to Warp for my personal laptop due to it’s performance, modern look, minimalistic setup, simplicity, builtin AI and high customizability.

Warp is a free Rust-based terminal designed for productivity and efficiency.

You can install the latest version using my  **[link](https://app.warp.dev/referral/EXJV8D)** to receive a unique theme.

Here are some of its key features:

- Blazing fast performance
- AI-powered command search and suggestions
- Split panes and tabs
- Customizable themes and color schemes
- Keyboard shortcuts and commands for efficient navigation and control

To customize Warp Terminal, go to preferences ( **Command (⌘) + ,** ) and customize the appearance, themes, and keyboard shortcuts to your liking.

**Disclaimer:** I am still using iTerm2 for my company laptop. Warp uses OpenAI for the AI features so please check if you are allowed to use it inside your company.

## 4. Install Oh My Zsh

[![Oh My ZSH logo!](https://substack-post-media.s3.amazonaws.com/public/images/967ebf99-b082-406c-8ae1-7fa5edb8df22_337x208.png)](https://substackcdn.com/image/fetch/$s_!pjFK!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F967ebf99-b082-406c-8ae1-7fa5edb8df22_337x208.png)

**[Oh My Zsh](https://ohmyz.sh/)**  provides a wide range of features, plugins, and themes to enhance your Zsh shell experience.

Install it using below commands:

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Follow the on-screen instructions to complete the installation.

## 5. Configure Zsh

### Install a Zsh theme:

While the builtin Warp terminal looks great, you can customize it further by installing external themes.

I started using  **[Powerlevel10k](https://github.com/romkatv/powerlevel10k)**  theme 3 years back and never looked back.

[![Powerlevel10k](https://substack-post-media.s3.amazonaws.com/public/images/b26bde0c-cab0-45f4-a0d3-8a689f62bc51_765x516.png)](https://substackcdn.com/image/fetch/$s_!1RCt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb26bde0c-cab0-45f4-a0d3-8a689f62bc51_765x516.png)Credit: https://github.com/romkatv/powerlevel10k

To install Powerlevel10k with Warp terminal, follow below instructions:

1. Install the recommended [fonts](https://github.com/romkatv/powerlevel10k?tab=readme-ov-file#meslo-nerd-font-patched-for-powerlevel10k).
2. Clone the repository assuming you have already installed Oh My Zsh:

```
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

1. Set ZSH_THEME="powerlevel10k/powerlevel10k" in ~/.zshrc.
2. Go to:  **Setting > Appearance > Text** in the Warp Terminal and change the font to  **MesloLGS NF** .
3. Go to:  **Setting > Appearance > Prompt** in the Warp Terminal and change it to  **Shell Prompt** .

More details in this blog:  **[How to setup powerlevel10k on warp](https://www.warp.dev/blog/how-to-set-up-powerlevel10k-on-warp)**

Other Zsh themes you can consider:

- [Spaceship](https://github.com/spaceship-prompt/spaceship-prompt)
- [agnoster](https://github.com/agnoster/agnoster-zsh-theme)

### Setup Oh My Zsh Plugins:

- List of Oh My Zsh plugins: [https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins)
- Open the .zshrc file in a text editor: vim ~/.zshrc
- Find the plugins section and add the desired plugins. Example: plugins=(git web-search docker kubectl)git: Provides helpful aliases and functions for Git.web-search: Allows searching the web directly from the terminal.docker: Provides auto-completion for Docker commands.kubectl: Adds auto-completion for Kubernetes command-line tool (kubectl) commands.
- git: Provides helpful aliases and functions for Git.
- web-search: Allows searching the web directly from the terminal.
- docker: Provides auto-completion for Docker commands.
- kubectl: Adds auto-completion for Kubernetes command-line tool (kubectl) commands.

### Configure aliases:

- Open the .zshrc file in a text editor: vim ~/.zshrc
- Add custom aliases and functions for frequently used commands.

```
alias dev='ssh user@dev-server'
```

## 6. Install additional productivity tools

### bat

***[bat](https://github.com/sharkdp/bat)***  is a command-line tool designed as an improved alternative to the traditional cat command. It provides syntax highlighting, git integration and other features for viewing files in the terminal.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/ba9066f6-4a88-49fa-b119-7491436e2218_1668x996.png)](https://substackcdn.com/image/fetch/$s_!xu6F!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fba9066f6-4a88-49fa-b119-7491436e2218_1668x996.png)https://github.com/sharkdp/bat

**Installation:** brew install bat

### eza

***[eza](https://github.com/eza-community/eza)***  is a modern replacement for the traditional ls command in the terminal. It provides a more user-friendly and feature-rich interface for listing files and directories.

**Installation:** brew install eza

Setup an alias in ~/.zshrc

alias ls="eza"

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8b0e7668-bd9a-4160-ac1d-0cdfd19471ca_1340x876.png)](https://substackcdn.com/image/fetch/$s_!ewdC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8b0e7668-bd9a-4160-ac1d-0cdfd19471ca_1340x876.png)https://github.com/eza-community/eza

### tree

The tree command is useful for displaying the directory structure of a given path in a hierarchical, tree-like format. It recursively lists the contents of directories and their subdirectories, providing a visual representation of the file system structure.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/15113c40-3082-41e7-af6a-37844d87d109_1126x1582.png)](https://substackcdn.com/image/fetch/$s_!blIB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F15113c40-3082-41e7-af6a-37844d87d109_1126x1582.png)

**Installation:** brew install tree

### tldr

tldr ("Too Long; Didn't Read") is a command-line tool that provides quick and practical examples of how to use commands without going through the extensive and sometimes overwhelming traditional man pages.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/809cc673-1ca8-4449-a9fa-96e6778580c0_1962x1108.png)](https://substackcdn.com/image/fetch/$s_!ouT9!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F809cc673-1ca8-4449-a9fa-96e6778580c0_1962x1108.png)

**Installation:** brew install tldr

### wget

wget is a command-line utility widely used for downloading files and web pages from the internet. It supports various protocols, including HTTP, HTTPS, and FTP.

**Example:**

```
wget https://example.com/file.zip
```

**Installation:** brew install wget

## 7. Useful Terminal Shortcuts

#### **Cursor Movement**

- **Option (⌥) + Left Arrow** : Move the cursor one word to the left.
- **Option (⌥) + Right Arrow** : Move the cursor one word to the right.
- **Command (⌘) + Left Arrow** : Move the cursor to the beginning of the line.
- **Command (⌘) + Right Arrow** : Move the cursor to the end of the line.

#### **Text Editing**

- **Option (⌥) + Delete** : Delete the word to the left of the cursor.
- **Command (⌘) + Delete** : Delete the entire line to the left of the cursor.
- **Command (⌘) + K** : Clear the Terminal screen

#### **Selections**

- **Option (⌥) + Shift (⇧) + Left/Right Arrow** : Select text one word at a time.
- **Command (⌘) + Shift (⇧) + Left/Right Arrow** : Select text to the beginning/end of the line.

#### **Clipboard Operations**

- **Command (⌘) + C** : Copy the selected text. When no text is selected, this copies the entire current line.
- **Command (⌘) + V** : Paste text from the clipboard.
- **Command (⌘) + X** : Cut the selected text.

#### **Managing Tabs**

- **Command (⌘) + T** : Open a new tab.
- **Command (⌘) + W** : Close the current tab.
- **Command (⌘) + Number** : Switch between tabs quickly.
- **Command (⌘) + Shift (⇧) +** [: Switch to the previous Warp Terminal tab.
- **Command (⌘) + Shift (⇧) +** ]: Switch to the next Warp Terminal tab.
- **Command (⌘) + D** : Split pane right.
- **Command (⌘) + Shift (⇧) + D** : Split pane down.

#### **Searching**

- **Command (⌘) + F** : Search within the terminal output.
- **Control (⌃)** +  **R** : Search the history backward for a command that matches the text you've typed.

You can find the full list of keyboard shortcuts in the warp [documentation](https://docs.warp.dev/features/keyboard-shortcuts).

### References:

- **[Warp: A New Terminal To Boost Developer Productivity](https://medium.com/codex/warp-a-new-terminal-to-boost-developer-productivity-a9332b42ba84)**
- **[You’re Missing Out on a Better Mac Terminal Experience](https://medium.com/@caulfieldOwen/youre-missing-out-on-a-better-mac-terminal-experience-d73647abf6d7)**

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
