---
title: Python script to archive large pdf into rar with 20x compression rate
description: python pdf to rar compress
date: '2022-02-22'
draft: false
slug: '/blog/python-compress-pdf-to-rar/'
tags:
  - Python
  - Linux
  - script
---

# Table of contents

```toc
exclude: Table of Contents
from-heading: 2
to-heading: 6
```

## Problem

Storing large PDFs (over 2GB) wastes server space and causes problems when downloading with Google Chrome.

## Solution

The most efficient way to save server space is to compress `PDF` to `RAR`.

RAR compression provides nearly 20x PDF compression and is currently the best compression algorithm for `pdf`
and can reduce file size tenfold
(comparison chart - zip, 7z, rar)

On a Linux server, this can be done by creating a watchdog script in [Python 3](https://www.python.org/downloads/)
and the [patool package](https://pypi.org/project/patool/).

### General idea of the script

1. When the `pdf` file appears and ready to work, archiving in `rar` will start.

**_Pay attention_** to the phrase `"the file is ready to work"`: _a file that is still in the process of being written
to disk cannot be called "ready to work". You need to wait, the file will be completely written to the disk, and only then you can work with it (otherwise the broken file will be archived, which then cannot be read)_.

2. After the successful creation of the `rar archive`, a `text file` will be created, which will be a kind of `marker`
3. signaling to any `external system` that the archive is `successfully ready`.

For example, if the external system is `Oracle`, and you want to write the `RAR file` into `database field`.
Here it is important to track the moment when the file is `completely ready` and formed for further actions.
For example, it may turn out that the file is not yet fully copied to the directory.
To do this, Linux has several file-specific events.

We need the following `Linux file system events`:

- IN_CREATE
- CLOSE_WRITE
- MOVED_TO
- MOVED_FROM
- IN_DELETE
- IN_DELETE_SELF

## Requirements

- [pyinotify](https://github.com/seb-m/pyinotify/wiki)

Pyinotify is a Python module for monitoring filesystems changes.
Pyinotify relies on a Linux Kernel feature (merged in kernel 2.6.13) called inotify.
inotify is an event-driven notifier, its notifications are exported from kernel space to user space through three
system calls. pyinotify binds these system calls and provides an implementation on top of them offering a generic and
abstract way to manipulate those functionalities.

Follow the official documentation to [install pyinotify](https://github.com/seb-m/pyinotify/wiki/Install).

- [patoolib](http://wummel.github.io/patool/)

Patool is a library for creating, extracting, testing archives, including in the RAR format.

How to install patool is described [here](https://github.com/wummel/patool/blob/master/doc/install.txt).

## Import Libraries and define variables

Let's create the `pdf_watchdog.py` file, where we will write our Python code.

First of all, we need to define script encoding, import libraries and define some variables.

```python:title=Header
# -*- coding: utf-8 -*-

import os
import pyinotify
import patoolib
from datetime import datetime

flags = pyinotify.ALL_EVENTS
dir = 'pdf/'
log_file = 'log_watcher.log'
```

Next, our watchdog should only watch files with specific extensions.

### Filter files by extension

Let's create

- `suffix_filter` method will filter files from a set of extensions that appear in the directory are defined in the `SUFFIXES` array.
- `write_log` method will write the log-file.

```python
SUFFIXES = {'.pdf', '.txt', '.rar'}


def suffix_filter(event):
    # return True to stop processing of event (to "stop chaining")
    return os.path.splitext(event.name)[1] not in SUFFIXES


def write_log(log_str):
    date_str = str(datetime.now().strftime('%Y.%m.%d %H:%M:%S')) + ': '
    res_str = date_str + log_str
    f1 = open(dir + log_file, 'a+')
    f1.write(res_str + '\r\n')
    f1.close()


class EventProcessor(pyinotify.ProcessEvent):
...
```

## EventProcessor

So, our `EventProcessor` class will take the `pyinotify.ProcessEvent` as a parameter and will process incoming events
from the filesystem.

```python:title=EventProcessor
class EventProcessor(pyinotify.ProcessEvent):

    def __init__(self, callback):
        self.event_callback = callback

    def __call__(self, event):
        if not suffix_filter(event):
            super(EventProcessor, self).__call__(event)

    def process_IN_CREATE(self, event):
        write_log('in CREATE: ' + event.pathname))

    def process_IN_DELETE(self, event):
        write_log('in DELETE: ' + event.pathname))

    def process_IN_DELETE_SELF(self, event):
        write_log('in DELETE_SELF: ' + event.pathname))

    def process_IN_MOVED_FROM(self, event):
        write_log('in MOVED_FROM: ' + event.pathname))

    def process_IN_MOVED_TO(self, event):
        write_log('in MOVED_TO: ' + event.pathname))

    def process_IN_CLOSE_WRITE(self, event):
        write_log('in CLOSE_WRITE: ' + event.pathname))

        if os.path.splitext(event.name)[1] == '.pdf':
            # if RAR-file already exists, delete it
            if os.path.exists(dir + event.name + '.rar'):
                os.remove(dir + event.name + '.rar')
                # if TXT-marker exists, delete it too
                if os.path.exists(dir + event.name + '.rar.txt'):
                    os.remove(dir + event.name + '.rar.txt')
                # creating rar archive
                patoolib.create_archive(dir + event.name
                  + '.rar', (dir + event.name,));
            else:
                # creating rar archive
                patoolib.create_archive(dir + event.name
                  + '.rar', (dir + event.name,));

        if os.path.splitext(event.name)[1] == '.rar':
            if not os.path.exists(dir + event.name + '.rar'):
                write_log('OK. RAR Archive created: ' + event.pathname))
                # creating txt-marker
                f = open(dir + event.name + '.txt', 'a')
                f.write('OK!')
                f.close()

                # deleting source pdf
                if os.path.exists(event.pathname[0:-4]):
                    os.remove(event.pathname[0:-4])
                else:
                    write_log('The file doesnt exist: ' + event.pathname))

```

## File watcher

The file watcher will monitor the files in the directory, and the events that occur with it will then be passed
to the `EventProcessor` input.

```python:title=FileWatcher
class FileWatcher:
    notifier = None

    def start_watch(self, dir, callback):
        wm = pyinotify.WatchManager()
        self.notifier = pyinotify.Notifier(wm, EventProcessor(callback))
        mask = (pyinotify.IN_CREATE
                | pyinotify.IN_MODIFY
                | pyinotify.IN_DELETE
                | pyinotify.IN_DELETE_SELF
                | pyinotify.IN_MOVED_FROM
                | pyinotify.IN_MOVED_TO
                | pyinotify.IN_CLOSE_WRITE)
        wdd = wm.add_watch(dir, mask, rec=True)
        write_log('Watchdog running...'))
        while True:
            self.notifier.process_events()
            if self.notifier.check_events():
                self.notifier.read_events()
```

## Start Watch

The last step in creating our script is to run the `start_watch()` method

```python:title=start_watch
f = FileWatcher()
f.start_watch(dir, None)
```

## Video demo of the pdf to rar compression

`video: https://youtu.be/EFdjKJ9xP0g`

© Alexander Khudoev. 2022
