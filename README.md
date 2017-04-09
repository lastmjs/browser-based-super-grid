Just a note, Professor Windley has already approved this, we talked with him about it in class on April 4, 2017.

# Browser-based Super Grid Proposal

# What will it do?

The system will parallelize a JavaScript program across an arbitrary number of browser peers. Peers may join other peers at will to help in the computation. Once a peer joins another peer, it will start receiving computation jobs. Peer-to-peer connections can scale arbitrarily. All computation will be completely client-side, no server will be necessary. This should allow for extremely easy on-the-fly distributed computing.

The source code of the jobs that will run will be stored on GitHub, and will be dynamically loaded through the GitHub API. Before the code is executed, it will be cryptographically verified with a public key stored on the MIT PGP Key Server, as an additional security check.

# What problem does it solve?

Currently parallel computing is complicated. It takes technical expertise and potentially expensive equipment. This project is one step in the direction of crowd-sourcing parallel computing, and using the idle resources of the world's computers better. We want to open parallel computing to the masses, and lower the costs of parallel computing infrastructure.

# Event architecture

* Publish work to be done
* Request to be a worker
* Work completed (job or batch)
* Intermediate result rumor (best result so far for a job or batch)

# APIs

* GitHub to pull down code from an open source repository
* MIT PGP Key Server

# Who

John Grosh
Jordan Last

# Work plan

## John
* UI
* WebRTC communication
* Algorithm

## Jordan
* GitHub integration
* PGP integration
* Code execution
* Project architecure, state management, and data flow

# Diagrams

![enter image description here](https://docs.google.com/drawings/d/1Uv0rXXEIHlaE7gr-UXU3ElSDU0-fvr6D_0UT1F7aejg/pub?w=960&h=720)

![enter image description here](https://docs.google.com/drawings/d/1FnWCnxMmjMJBy-0KmErkQjRR5_Q_0gKK0P-FLSiEDYc/pub?w=960&h=720)

# README

## Installation



## Use

* Upload script
* Upload script signature

To sign the script, install gpg, create a private and public key pair, and then run the following command in the same directory as the script to be signed:
```
gpg --clearsign --output [script name].sig --sign [script name]
```

Upload your public key to the MIT PGP Key Server.

## Experiments

Product | Number of browser instances | Connection type | Time elapsed
--- | --- | --- | ---
5010940919 | 1 | 1 | ~300 seconds
5010940919 | 2 | 1 -> 1 | ~160 seconds
5010940919 | 3 | 1 -> 2 | ~140 seconds
5010940919 | 4 | 1 -> 3 | ~75 seconds
5010940919 | 5 | 1 -> 4 | ~60 seconds
