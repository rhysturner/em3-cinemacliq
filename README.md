# em3-cinemacliq  
#### Rhys Turner
#### rhys.turnstylez@gmail.com

## About
Electronic Musieum Google Cardboard WebVR Artwork.



## Installation
1. [NodeJS](nodejs.org)
1. [three.js ](three.js)
1. [vrrenderer.js](vrrenderer.js)

In terminal run

    $ npm install

Then to start

    # npm start

And go to localhost:8080 in your browser or visit <your-machines-ip>:8080 on your mobile phone and place in a google cardboard.


## Roadmap  
### 1. Sound Reactive  
### 1. Different views/environments

## Acknowledegements  
@borismus [webvr-boilerplate](https://github.com/borismus/webvr-boilerplate) for clean cross-platform WebVR
@dghost [hopalong-vr](https://github.com/dghost/hopalong-vr) for the hopalong webvr port Barry Martin's Hopalong Orbits Visualizer which I found here [hopalongvr.dghost.net](http://hopalongvr.dghost.net)
@[Iacopo Sassarini]()https://www.chromeexperiments.com/experiment/webgl-attractors-trip

## Fractals & Hopalong 
Barry Martin's Hopalong Orbits Visualizer
These orbits are generated iterating this simple algorithm:
(x, y) -> (y - sign(x)*sqrt(abs(b*x - c)), a -x )
where a, b, c are random parameters. This is known as the 'Hopalong Attractor'.
3D rendering done with three.js and vrrenderer.js