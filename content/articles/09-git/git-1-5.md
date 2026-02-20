---
title: "Course Setup"
description: "Learn how to install Git on Windows, macOS, and Linux, verify your installation, and start practicing with a sample repository for hands-on Git experience."
datePublished: 2026-02-12
dateModified: 2026-02-12
topics:
  - javascript
courseName: 09-git
showOnArticles: false
featured: false
---


![image.png](https://github.blog/wp-content/uploads/2024/05/GitHub-for-beginners.png?w=1024)


# How to Install Git and Start Practicing with a Sample Repository

Git is a powerful version control system widely used by developers for tracking changes in source code during software development. Whether you're a beginner or looking to refresh your skills, understanding how to properly install Git and start using it is essential. This guide will walk you through the installation process on various operating systems, verify your setup, and provide a practical way to practice Git commands using a sample repository.

## Installing Git Locally on Your Computer

Git can be installed on all major operating systems including Windows, macOS, and Linux. The official Git website ([git-scm.com](https://git-scm.com/)) provides detailed instructions tailored for your specific OS. Follow the steps below based on your platform.

### Installing Git on Windows

1. Visit the official Windows Git installation page: [Git for Windows](https://git-scm.com/install/windows).
2. Download the latest Git installer (.exe file).
3. Run the installer and follow the prompts, choosing default options unless you have specific preferences.
4. Upon completion, Git will be available in your command prompt or Git Bash terminal.

### Installing Git on macOS

1. Navigate to the macOS installation instructions here: [Git for macOS](https://git-scm.com/install/mac).
2. You can install Git via Homebrew by running the command:
   ```bash
   brew install git
   ```
3. Alternatively, download the official Git installer package for macOS and follow the installation wizard.
4. Verify the installation using the terminal once complete.

### Installing Git on Linux

1. For Linux users, Git is commonly available via your distribution’s package manager.
2. Visit the Linux installation instructions: [Git for Linux](https://git-scm.com/install/linux).
3. For example, on Ubuntu or Debian-based systems, use:
   ```bash
   sudo apt-get update
   sudo apt-get install git
   ```
4. On Fedora, CentOS, or RHEL, use:
   ```bash
   sudo dnf install git
   ```
5. Confirm the installation once done.

## Verifying Your Git Installation

After installing Git, it’s important to confirm that the setup was successful.

### How to Check Your Git Version

1. Open your terminal (Command Prompt on Windows, Terminal on macOS or Linux).
2. Type the following command and press enter:
   ```bash
   git --version
   ```
3. If Git is installed correctly, you will see an output similar to:
   ```
   git version 2.x.x
   ```
4. This version number indicates that Git is ready to use.

If you encounter any errors or do not see the version information, review the installation steps or consult the official Git documentation for troubleshooting.

## Start Practicing Git with a Sample Repository

Hands-on experience is the best way to learn Git. To get you started, we provide a sample repository that you can clone and experiment with.

### Cloning the Practice Repository

1. Open your terminal.
2. Run the following command to clone the repository to your local machine:
   ```bash
   git clone https://github.com/ashishps1/git-practice-repo.git
   ```
3. Navigate into the cloned directory:
   ```bash
   cd git-practice-repo
   ```
4. You are now ready to try Git commands within this repository.

### Why Practice with a Sample Repo?

- **Safe Environment:** Experiment with commits, branches, and merges without risk to your own projects.
- **Familiarization:** Learn how Git tracks changes and manages code versions.
- **Confidence Building:** Running commands in a real repository solidifies your understanding.

### Creating Your Own Test Repository

If you prefer, you can also create a personal test repository:

1. Create a new directory on your computer.
2. Initialize Git inside it by running:
   ```bash
   git init
   ```
3. Add files and practice common Git operations like add, commit, push, and branch.

## What’s Next?

Once you’re comfortable with installing and verifying Git, and cloning repositories, the next step is to customize your Git environment. This includes configuring your user information, setting aliases for commonly used commands, and adapting Git to your workflow to boost productivity.


### Summary

- Git installation varies by operating system; official instructions ensure proper setup.
- Verifying Git installation is simple with the `git --version` command.
- Cloning the sample repository enables practical, hands-on learning.
- Experimenting in a test repository builds confidence and familiarity with Git.

By following this guide, you will have a fully functional Git installation and a practical environment to start mastering Git commands. Stay tuned for advanced tutorials on customizing and optimizing your Git workflow!