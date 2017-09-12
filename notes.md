# WORK IN PROGRESS

These are preliminary notes, for own use.

# General notes

Purpose:

- Infrastructure for no-server HTML5 apps => a decentralized trustless computer for the web

In short:

- Network topology: kademlia like, - address = hash of pubkey
- State/storage: each node stores a neighbourhood around its own address, saved in blockchain merkeltree
- Operations: changes to state are verifiable, and verified by nodes in neighbourhood
- Balance: nodes gets paid for doing tasks for the network, and can use this to buy tasks in the network. Also pay/payout for state blockchain.
- Tasks: stored, nodes assigned to tasks in deterministic random part of storage, proof-of-result stored, result stored, verification/value, balance updated.

Additional notes:

- WebPlatform: computations in webassembly. WebRTC as transport (thus modified kademlia). Crypto-algorithms from crypto.subtle.
- Neighbourhood size and amount of state per node - determined by node density (global minimum density / local density). Fixed amount of memory per node.
- Mutable references in blockchain (using balance to keep alive)
- Autonomous processes (using balance to keep alive)
- Not entire blockchain stored, only parts needed by the node
- Stake in computation tasks
- Balance/trade between processes
- Introduced 'errors' in blockchain, and bounties for finding/proving them.
- Binary/Quad merkel tree for proofs
- Pub/private-key derived from entropy source
- Task types: computation, storage, storage-transfer, find node with certain data
- Node trust / reliability proof via blockchain
- Block-tree rather than chain
- Computational task level of validation
- Result safety: added to state by any node in neighbourhood by proof of distance of computing-node to task.
- Computational task: computing time bound, and cost calculation.
- consensus algorithm: CRDT, additional data in timeinterval: after last block, before timed signature from other deterministic random node
- Tagged overlay network - opt-in part of infrastructure for tunable bandwidth requirements
- Network simulation (core optimised for low memory)
- Bandwidth optimised, - number of significant bits per node-id, stream compression, only send diffs etc.

Explore/ideas:

- Performance characteristics of current WebRTC implementations
- Performance effects of design choices for Kademlia-like algorithm on top of WebRTC (instead of UDP)
- Verifiable "computational" tasks, and economy based "computation".
- (Survey p2p overlay networks)
- WebRTC bootstrapping options (decentralised signalling server vs. actual node)
- Infrastructure deployment - bootstrap-code + load signed version of code from network, - partly test within network before full deploy.

Description of algorithm:

- nodes connected in kademlia-like structure
- regular state snapshot (blockchain merkel-dag)
    - divide-and-conqueor consensus algorithm, verifying credit updates in neighbourhood.
    - each node stores the state of a neighbourhood around its own address, as well as the path to the root. The neighbourhood size is fixed for all, ensuring good redundancy of data for 
- content of state
    - list of entities(nodes)
        - id
        - balance/credits (updated by work, tasks, cost of staying in blockchain, and transfers)
        - state (+ proof)
        - tasks - scheduled for execution - wager
        - result of previous scheduled task
        - work
            - stake
            - result
            - proof-of-work
        - state
- verifiable tasks
- task types
    - computation
    - storage
        - data
        - key/value
    - random verifications (of proof-of-stake tasks)
    - blockchain verification
- entities
    - nodes
    - nodes with stake
    - accounts (pub-key)
    - autonomous
- computational process
    - task gets stored in blockchain
    - task gets assigned to a number of bcrandom nodes
    - task gets done, and proof-of-work gets stored in the blockchain
    - task result gets released
    - result+proof-of-work get validated + signed into blockchain
    - balance is updated

Design criteria

- low bandwidth
- low memory footprint (useful for large simulation, as well as embeded systems)
- low code footprint
- tagging of hosts
- connect to arbitrary host
- foundation for other p2p applications

# Roadmap

Implementation strategy:

- Mode of development
    1. Make prototype/proof-of-concept
    2. Measure performance (actual + simulated) + experiment with protocols
    3. Implement optimised version
- Levels of functionality. (subject to change)
    1. Simple p2p overlay network on top of webtechnology
    2. "Tagging" in overlay network (connections/DHT)
    3. Network state / map, - state blockchain updated divide-and-conquer.
    4. Tasks enqueued/executed in state
    5. Credit-balance in network, through proof of work
    6. Computing units, pubkey units, autonomous units/calculations.
    7. Add stake to computations for stronger security
- Auxiliary tasks:
    - Bootstrap gateway in php
    - Generate DSA from user-supplied entropy source.
    - Deployment system for new versions
    - (maybe paper Benchmark performance and limitations of WebRTC)
    - (maybe paper Review Kademlia optimisations from the viewpoint of webrtc networking model)
    - (maybe paper describing aspects of overall vision and architecture)
- Later
    - Optimisations for efficient p2p shared state (partial addresses, cached/multi-data hash proofs (quad instead of binary - same amount of data, but bette caching))

Writeups:

- Bottom-up
    - Algorithm for overlay network with taggable nodes
    - Kademlia for the Web Platform (Kademlia originally designed for IP/UDP, which have different performance characteristics than what is available on WebPlatform(WebRTC). Survey extensions / optimisations of Kademlie, and evaluate how they matches).
    - Performance characteristics of p2p data on the web platform. (measure cost of initiating connection, limits / performance with many connection or data). Across the different platforms.
-  Top-down
    - Design / execution model of a computational blockchain
    - Proveable tasks for for trustless computing
    - Definitions and concepts for reasoning about a p2p computing model

# Possible publication targets

Ideas of places for publications:

- Open Access Journals (NB: <https://doaj.org>)
    - [Ledger Journal](http://ledgerjournal.org) 
    - [EAI Transactions on Scalable Information Systems](http://eai.eu/transaction/scalable-information-systems)
    - [Computer Science (AGH)](https://journals.agh.edu.pl/csci)
- ACM/IEEE (pay for open access)
    - [IEEE Transactions on Parallel and Distributed Systems]()
    - [ACM Transactions on Computer Systems (TOCS)]()
- Conferences (in Europe)
    - 2017-10-30 2018-02-26/28 [IFIP NTMS 1st International Workshop on Blockchains and Smart Contracts (BSC)](http://www.wikicfp.com/cfp/servlet/event.showcfp?eventid=67425&copyownerid=102766)
    - ~~2018-02-05 2018-06-20/22 [DCAI 2018 : 15th International Conference on Distributed Computing and Artificial Intelligence](http://www.wikicfp.com/cfp/servlet/event.showcfp?eventid=66780&copyownerid=95447)~~
    - (2018-02-11 2018-07-23/27 [ACM Symposium on Principles of Distributed Computing](https://www.podc.org/))
- Central non-conference sources (based on related articles)
    - "The Computing Research Repository" (not a Journal, but arXiv, indexed in dblp etc.)
    - [Peer-to-Peer Networking and Applications](http://www.springer.com/engineering/signals/journal/12083) (Springer)
    - ~~Computer Networks (avoid Elsevier)~~

# Literature

Various articles etc. that I should take a look add (and possibly add notes here eventually)

- [@delegate-verify-public-verifiable-computing-2012]
- [@embracing-peer-next-door-kademlia-2008]
- [@ethereum-yellowpaper-2014]
- [@golem-whitepaper-2016]
- [@handling-churn-dht-2004]
- [@improving-lookup-kademlia-2010]
- [@ipfs-2014]
- [@kademlia-2002]
- [@noninteractive-verifiable-computing-2010]
- [@performance-chord-kademlia-churn-2015]
- [@performance-evaluation-kademlia-2010]
- [@pinocchio-nearly-practical-verifiable-computing-2013]
- [@s-kademlia-2007]
- [@subsecond-lookup-kademlia-2011]
- [@survey-simulators-overlay-networks-2017]
- [@trustless-computing-what-not-how-2016]
- [@stefan-phd-2008]
- [@webassembly-2017]

<https://allquantor.at/blockchainbib/bibtex.html>

# Notes for later / optimised version

- page size
  - typically 4K (getpagesize() is 4K on my linux, and that looks like common size via <https://en.wikipedia.org/wiki/Page_%28computer_memory%29>)
  - webassembly 64K page size
- minimise memory usage (for ability to run large simulations).
  - i.e. 64K per nodes => 100K nodes in memory simulation ~ 6G memory

# Bibliography
