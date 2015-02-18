/*
Sending Jitter data to a Neopixel ring
Sarah Angliss 16 February 2015
With thanks to Fadecandy creator Micah Scott (Scanlime) and Adafruit
Thanks also to data David Haylock (@PMStudioUK) for explaining the OPC protocol

Version 1.0 - this is rough and barely tested but you are welcome to experiment with it 'as is', and to copy with attributions.
Works for a 16 neopixel ring only
Next step is to convert this Javascript file into a C-based external and to incorporate downsampling, assorted input video sizes and Neopixel types.

Sarah's website: www.sarahangliss.com
Fadecandy Github: http://scanlime.org/2013/11/fadecandy-easier-tastier-and-more-creative-led-art/
PM Studio, Bristol, UK: http://www.watershed.co.uk/pmstudio/welcome-pervasive-media-studio
*/

inlets = 1;
outlets = 3;

//Welcome info
post(" \n");
post("jitToNeoRing16 - sends data to a 16 Neopixel ring \n");
post("Version 1.0 - this is a rough and barely tested \n");
post("but you are welcome to use 'as is' and to copy with attributions.\n");
post("Created by Sarah Angliss (@Therematrix) with thanks to")
post("Micah Scott (@Scanlime), @Adafruit and David Haylock (@PMStudioUK) \n");
post("www.sarahangliss.com");
post(" \n");



var type = "no type"; //the type of neopixel (ring, grid, etc)
var thisChannel = 0;
var neoPixels = 16;
var ringDiam = 0.36;
var offsetX = 0;
var offsetY = 0;
var angle = 0; //Change this if you want to offset the angle of the pixels

var blockColour = [255, 255, 255, 255];

//Matrix size - in next version, I plan to make this adjustable
var width = 640;
var height = 480;


//Matrix holding the colour data for the neopixels
var neopixelMatrix = new JitterMatrix(4, "char", neoPixels, 1); //sends out final colours
neopixelMatrix.setall(255, 0, 0, 0);

//The x and y positions of the LEDs
var led = [[]]; 

//Incoming video matrix
var inputMatrix = new JitterMatrix(4, "char", width, height); 

//Matrix to be processed
var mixerMatrix = new JitterMatrix(4, "char", width, height); 
mixerMatrix.setall(255, 0, 0, 0);


//Matrix above, after brcosa applied 
var fadedMixerMatrix = new JitterMatrix(4, "char", width, height); 
fadedMixerMatrix.setall(255, 0, 0, 0);

//Matrix holding the LEDs in position on the video
var ledViewerMatrix = new JitterMatrix(4, "char", width, height); 
ledViewerMatrix.setall(255, 0, 0, 0);

//Create the LED ring
ledRing(width/2, height/2, width* ringDiam * 0.5, angle, offsetX, offsetY);


//The data to send to the Fadecandy
var fcData = [];

//Jitter object - brcosa
var neoBrcosa = new JitterObject("jit.brcosa");
neoBrcosa.brightness = 1.0;
neoBrcosa.saturation = 1.0;
neoBrcosa.contrast = 1.0;


//read an incoming movie matrix - this becomes the signal to sample
//the movie dimensions are sent automatically via moviedim
function jit_matrix(inMatrix){
mixerMatrix.name = inMatrix;
sendOutput();

}

//NOT IN USE AT THE MO - WILL BE USED IN VERSION 2!
function moviedim(xD, yD){
width = xD;
height = yD;

//Make the ring match the movie size
ledViewerMatrix.setall(255, 0, 0, 0);
ledRing(width/2, height/2, width* ringDiam * 0.5, angle, offsetX, offsetY);
sendOutput();
}




//Send the output - each pixel is a random colour
function random(){
mixerMatrix.setall(255, 0, 0, 0);

//find the pixel distance and use this to set the square size
var x1 = led[1][0];
var y1 = led[1][1];
var x2 = led[2][0];
var y2 = led[2][1];
var xDist = x2 - x1;
var yDist = y2 - y1;
var dist = parseInt( 0.7 * Math.sqrt((xDist * xDist) + (yDist * yDist)) );
dist = constrain(dist, 1, width * 2);
for (var p = 0; p < neoPixels; p++)
{
var pX = led[p][0];
var pY = led[p][1];
var r = Math.random(256);
var g = Math.random(256);
var b = Math.random(256);

for (var d=0; d<dist; d++)
 	 {
for (var h=0; h<dist; h++)
{
mixerMatrix.setcell(pX + d - dist/2, pY + h - dist/2, "val", 255, r, g, b);
}
}
}


sendOutput();
}

//Set the transmission channel on the Fadecandy
function channel(c){
thisChannel = c;
}
//Set a block colour
function block(r, g, b){

//Block colour 0 is the alpha channel
blockColour[1] = r;
blockColour[2] = g;
blockColour[3] = b;

mixerMatrix.setall(blockColour); //Set the strip used to find the colours
sendOutput();

}

function brightness(b){

neoBrcosa.brightness = b; // set brightness for feedback stage
sendOutput();
}

function saturation(s){

neoBrcosa.saturation = s; // set brightness for feedback stage
sendOutput();
}

function contrast(cn){

neoBrcosa.contrast = cn; // set brightness for feedback stage
sendOutput();
}

function dumpout(){
post("16 neopixel ring, channel " + thisChannel + ".\n");
}




//keep numbers within constraints
function constrain(p, pMin, pMax){
if (p > pMax) p = pMax;
if (p < pMin) p = pMin;
return p;
}

 // Set the locations of a ring of LEDs
//The centre of the ring is offset from the centre of the screen by offsetX, offsetY
//The diameter of the ring is diam
//The topmost pixel is led 0 and pixel numbers increase clockwise
function ledRing(x, y, radius, angle, offsetX, offsetY){
  
    for (var i = 0; i < neoPixels; i++)
{
      var a = angle + (i * 2.0 * Math.PI )/ (1.0 * neoPixels);
var xSpot = parseInt( x + radius * Math.sin(a) + offsetX );
var ySpot = parseInt( y - radius * Math.cos(a) + offsetY );
      led[i] = [xSpot, ySpot];
//use these points to set the ledViewerMatrix
ledViewerMatrix.setcell(xSpot, ySpot, "val", 255, 255, 255, 255);

    }
  }

//change the ring diameter relative to the view if a new diameter is given
function diameter(d){

ringDiam = d;

ledViewerMatrix.setall(255, 0, 0, 0);

ledRing(width/2, height/2, width* ringDiam * 0.5, angle, offsetX, offsetY);

sendOutput();
}


//change the ring diameter relative to the view if a new offset
function offset(x, y){

offsetX = x;
offsetY = y;

ledViewerMatrix.setall(255, 0, 0, 0);

ledRing(width/2, height/2, width* ringDiam * 0.5, angle, offsetX, offsetY);

sendOutput();

}


//This looks at the colour values of the mixer matrix and sets neopixelMatrix as required
function calcLedColours(){
outputMatrix = fadedMixerMatrix;
for (p=0; p < neoPixels; p++)
{
var pX = led[p][0];
var pY = led[p][1];
var visiblePixel = true; 
if ((pX <0 ) | (pX >= width)) visiblePixel = false;
if ((pY <0 ) | (pY >= height)) visiblePixel = false;
//If pixels are out of shot, make their colour 255, 0, 0,0 (i.e. off)
if (!visiblePixel)
{ 
neopixelMatrix.setcell(p, 0, "val", 255, 0,0,0); 
}
//If pixels are in shot, make them follow the fadedMixerMatrix colour
//and show them on the input matrix as complimentary colours (for easy viewing)
   else
{ 
var thisPixel = [];
 
thisPixel= fadedMixerMatrix.getcell(pX, pY);
var r = thisPixel[1];
var g = thisPixel[2];
var b = thisPixel[3];
neopixelMatrix.setcell(p, 0, "val", 255, r, g,b); 
//then put the compliment of this colour into the output matrix - so LEDs can be spotted easily
//also make it a bit bigger
outputMatrix.setcell(pX, pY, "val", 255, 255 -r, 255 - g, 255 - b); 
outputMatrix.setcell(pX + 1, pY +1, "val", 255, 255 -r, 255 - g, 255 - b); 
outputMatrix.setcell(pX + 1, pY -1, "val", 255, 255 -r, 255 - g, 255 - b); 
outputMatrix.setcell(pX -1, pY + 1, "val", 255, 255 -r, 255 - g, 255 - b); 
outputMatrix.setcell(pX -1, pY - 1, "val", 255, 255 -r, 255 - g, 255 - b); 
}

}
}

function sendOutput(){

//apply the brightness, constrast and saturation
neoBrcosa.matrixcalc(mixerMatrix, fadedMixerMatrix); 
//make the data that gets sent to Fadecandy
calcLedColours();
makeFadeCandy();
//send to outputs

//Send a list to Fadecandy twice as it needs it
outlet(0,fcData);
outlet(0,fcData);
//Show the Fadeandy data as a strip of colours - one colour per LEDs
outlet(1,"jit_matrix", neopixelMatrix.name);

//Show the data that makes up the 
outlet(2,"jit_matrix", outputMatrix.name);
}


//Convert the matrix data into Fadecandy data
function makeFadeCandy(){
    //These first four numbers are the four header bytes required by Fadecandy
fcData[0] = thisChannel;
fcData[1] = 0;
fcData[2] = 0;
fcData[3] = 3 * neoPixels;
for (var p=0; p < neoPixels; p++)
{
var thisPixel = [];
 	 thisPixel= neopixelMatrix.getcell(p,0);
 	 fcData[4 + (3 * p)] = thisPixel[1];
fcData[5 + (3 * p)] = thisPixel[2];
fcData[6 + (3 * p)] = thisPixel[3];
}
}