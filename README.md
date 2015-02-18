### Jitter to Fadecandy Neopixel controller

This is Version 1.0 of a rough and ready Fadecandy Neopixel controller, using Max, Jitter and Javascript. It's also my first attempt to post anything on Github so do be kind (and let me know) if you spot anything awry!

I've created this in Max 7 on OSX 10.9.4 - they open in Max 6 and 7.



### What these patches can do

These patches are basic and barely tested but they let you do the following in real-time:

* Use a Jitter video to control the colours of a 16 Neopixel ring via a Fadecandy controller (the controller is from Scanlime and Adafruit).

* Move an image on the video screen to control the LEDs (in style of Scanlime's Processing demos).

* Vary brightness, contrast and saturation of the LEDs.

* Downsample the input (for smoother results on the LEDs)

* Give the LEDs random colours.

* Fill all the LEDs with a uniform colour.



* View the OPC code as it's sent to Fadecandy.

I've developed this patch while I've been working on a motion capture experiment, for which it's been very useful to control LEDs via Max. There are already various excellent [Fadecandy](http://www.adafruit.com/product/1689) controllers out there - most notably Scanlime's controllers using Processing. But as I'm a musician, I find it easiest and quickest to prototype devices in Max and Jitter, hence these patches.

Using this, it should be possible to experiment with various forms of real-time audio and video control of Neopixels, using Max. Lovely!


### Requirements

To run this and see results you'll need:

* [Max](https://cycling74.com) 6 or 7 (you can open these as runtime files in 6 if you want to try them but don't have an editing licence)

* A tcp client for Max. This must be in your search path (or in the same folder as your Max patch). In these patches, I've used [sadam.tcpClient](http://www.sadam.hu/) from Ádám Siska (used with thanks).

* The Fadecandy server which must be up and running. See [Scanlime's Fadecandy pages](http://scanlime.org/2013/11/fadecandy-easier-tastier-and-more-creative-led-art/)
for more info.

### Constraints

* These patches only work with a 16 Neopixel ring. However, you can change the value of 'neoPixels' in the Javascript to vary the ring size.

* The patches are built around a Javascript object jitterToNeopixel16.js - Javascript limits the maximum frame rate etc. of the patch.

* I have a feeling the dithering isn't quite right yet, comparing my Scanlime dot patch to Scanlime's original Processing examples. 





### What I'd do next if I had time

* Modify the Javascript object so users can select a grid-shaped or ring-shaped Neopixel of various sizes, using messages.

* Port the Javascript into a C external for faster running.

* Create a patch that automatically maps a single Jitter Matrix across several LED grids at once.

* Investigate dithering in more detail for better effects.




### Feedback and acknowledgements

This is Version 1.0 - a scratch programme put together very swiftly as a tool for Trace, a larger project, funded by Arts Council England. 

Developer: [Sarah Angliss](http://www.sarahangliss.com)

Thanks to Micah Scott ([Scanlime](http://scanlime.org/2013/11/fadecandy-easier-tastier-and-more-creative-led-art/)) and [Adafruit](http://www.adafruit.com/product/1689) for posting such useful notes on their Fadecandy controller, Neopixels and OPC. I've rifled through these at length to create these rough and ready patches.

Thanks also to David Haylock at the [Pervasive Media Studio, Bristol, UK](http://www.watershed.co.uk/pmstudio/welcome-pervasive-media-studio), for showing me Neopixels and helping me to fathom the OPC protocol.

Thanks to [Ádám Siska](http://www.sadam.hu/) for use of his sadam.tcpClient.




Sarah Angliss  
[www.sarahangliss.com](http://www.sarahangliss.com)
@Therematrix
 





