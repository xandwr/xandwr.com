---
title: sshls
description: A small Rust utility for keeping track of SSH destinations and generating a local OpenSSH configuration.
href: "#sshls"
repository: https://github.com/xandwr/sshls
category: tooling
tags:
  - Rust
order: 3
writeup: true
---

I had some new computers that I was putting Ubuntu Server on, and I wanted to manage them as a small fleet from my Windows machine without having to remember each address, user, and key...
or repeatedly digging through my SSH configuration to remind myself what I had called everything on this current device.

OpenSSH already handles the important part. Once a host is configured, I can type something like `ssh serverbox` and passwordless access just works.
What I was missing was a simple way to *know about* the boxes I had configured.
Something like a ready-to-go inventory of their friendly names and connection details.

From these ashes, a baby named `sshls` was born.

### Deliberately tiny

`sshls` keeps a small TOML inventory of SSH destinations and generates an OpenSSH configuration fragment from it.
I can add, edit, tag, search, clone, or remove a destination through the CLI, then continue connecting with the ordinary `ssh` command.

When OpenSSH semantics matter, `sshls` asks the installed SSH client directly, so its only job is to maintain the small piece of configuration it owns.

That boundary was important to me, because I wanted the cross-platform utility that solved my immediate Windows-and-Linux setup, not a new system that I would have to keep tending.
Rust was a natural fit: it gave me a single binary for each machine, good cross-platform support, and strong tools for making file handling predictable. Also, unit testing in Rust is still unmatched. :)

### Built to be neglected

The goal was the smallest “never touch again” version of the tool, which meant putting effort into failure cases instead of adding more features.

Some of these considerations:

- Inventory changes are validated and written atomically
- Concurrent processes are locked out
- Generated output is deterministic
- Managed files receive restrictive permissions on Unix and a user-only ACL on Windows
- If writing the generated configuration ever fails, the TOML inventory remains the source of truth and a later sync can repair it

The result: run `sshls` to see the servers I have defined, and run `ssh serverbox` to connect to one.
Shorthand for my current SSH setup while leaving OpenSSH to do what it already does well; mission accomplished!

---

```console
> sshls

NAME        DESTINATION         TAGS
brainbox    xander@10.0.0.123   agents, ai, inference
serverbox   xander@10.0.0.321   game-hosting, relay, server
```

---

```console
> sshls -h
A small, durable inventory for SSH destinations.

Usage: sshls.exe [COMMAND]

Commands:
  show      Show one managed destination
  find      Search names, destinations, users, and tags
  resolve   Show what the installed SSH client will actually use
  test      Attempt a bounded, non-interactive SSH connection
  add       Add a managed destination
  edit      Changed a managed destination
  clone     Duplicate a managed destination
  rename    Rename a managed destination
  rm        Forget a managed destination
  tag       Manage tags
  config    Check or regenerate OpenSSH configuration

Options:
  -h, --help      Print help
  -V, --version   Print version
```

---
