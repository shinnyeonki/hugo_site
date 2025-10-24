---
title: rooting
date: 2025-10-24T20:53:41+09:00
lastmod: 2025-10-24T20:53:41+09:00
resource-path: 02.inbox/OneNote/html and css/리눅스/rooting.md
draft: true
---
**All comments before this are misleading.**

==Mobile SoC boot process is more complicated than PC boot process. Android phones have 3 stages with different bootloaders. Basically, first two stages are inaccessible as they are fused by the developer in the production mode (which phones are released in). Third one is the one stored in androids boot partition. Roughly, the bootloader hash key should match the one hardcoded into the SoC. First stage bootloader checks the hash key and passes the control to the second stage bootloader. In case of mismatch, the phone goes to the first stage bootloader which boots the recovery mode (EDL, or emergency download mode). In case of match, the second stage bootloader is placed in EFS filesystem (inaccessible in production mode), which is similar to BIOS - it contains all the configuration to initialize all the hardware components. It's called linuxloader bootloader (you can dig it out from xbl.elf of your phone's firmware) which boots one of the EFS partitions, containing the images, you may see on your phone in /dev/block/by-name directory (path can differ). These images contain the main partitions that you flash with an android firmware - boot, recovery, system, vendor, modem, etc. There are also other partitions, but they are not accessible. For example, toolsfv partition in development phones are used to open boot menu, which allows accessing shell, disabling secure boot, booting from usb, etc. You may find the description in Google. Second stage bootloader also provides access to the hypervisor (virtualization, that allows running virtual machines using kvm). Third stage bootloader is simply an android bootloader, which boots your lovely android OS.==

==Why users don't have the access to the 1st and 2nd stage bootloaders? To the first one — for security reasons and to prevent the phone from becoming a brick. You simply cannot kill the phone flashing your android firmwares, even the wrong and corrupted ones. To the second one — security, i guess. Or Google's android monopoly? (Apple doesn't look like the only bad guy, yeah?).==

==Anyways, you can't access anything above third stage bootloader in the production mode so don't bother. Technically, you can build a bootloader with closed source hardware PE32 drivers, configure them and make a nice looking BIOS menu. Practically — good luck finding closed source drivers and configuration files and using them (it's illegal, you know). There are several attempts you might have heard of until now but this will never reach the mass production. The only way I guess is to build your on phone with your own developed SoC using open source solutions.==

==All hail the corporations! Peace.==