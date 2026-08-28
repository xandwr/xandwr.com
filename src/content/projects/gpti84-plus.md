---
title: GPTi84-Plus
description: Fulfilling a childhood dream.
href: "#gpti84-plus"
repository: https://github.com/xandwr/GPTi84-Plus
category: personal
tags:
  - Python
  - Just
  - Embedded
  - Firmware
order: 4
writeup: false
---

It's a TI-84 Plus that talks to a large language model using some bit-banging of the serial port on the calculator, a wireless microcontroller, and a whole lot of head-scratching.

```
[ TI-84 Plus ] -- 2.5mm link cable --> [ Pico W ] --(WSS)--> [ relay ] --> [ Ollama / OpenAI / ... ]
       ^                                                                          |
       +---- arrow-key pager (TI-BASIC) <-- silent-link push <-------- paginated reply
```

## Hardware

- TI-84 Plus (any 84+ family calculator with a 2.5mm link port).
  Tested on plain 84+ (not Silver Edition, not CSE/CE).
- Raspberry Pi Pico W for wireless comms with the relay server.
- Cable: a 2.5mm TRS link cable wired to two Pico GPIOs and ground.
  Default pin mapping in `src/wire.py`: TIP -> GP6, RING -> GP7. Both
  lines have internal pullups enabled.

On the wire, the pico talks DBUS (TI's silent-link protocol over the 2.5mm port) to
the calculator. The wire layer is a software bit-bang: idle is both
lines high, sender pulls one line low to encode a bit, receiver
acknowledges by pulling the other low. bytes are LSB-first. packets are
`[machine_id][cmd][len_lo][len_hi][data...][cs_lo][cs_hi]`.

The chat path uses two transfer directions:

- **Calc -> Pico**: Z80 program (`CHAT.z80`) calls `_SendVarCmd` for
  Str1 (text) and Str2 (math). The Pico's listen loop receives them via
  the standard RTS/CTS/DATA flow.
- **Pico -> Calc**: PC-master push of Str3..Str9, Str0 (reply pages),
  followed by real var N (page count). The calc has to be at the home
  screen for the OS's idle silent-link receive to accept these: the asm
  exits cleanly so the deck is parked there before the push starts.

There is a settle delay (`SETTLE_MS` in `src/bridge.py`, default 600ms)
between pushes: the OS needs wallclock to rearm the idle silent-link
receive after each redraw.

The web console tails every WebSocket frame the relay handles,
which made debugging the calc-to-LLM round trip vastly easier than
guessing from one side of the wire at a time.
