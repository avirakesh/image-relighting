# Image-relighting
## Goal
When a picture is taken, it is easy to change to brightness of specific regions, but it is difficult to add more realistic light sources to the picture without careful manipulations. We attempt to make it easier to add new light sources to picture.
## Inspiration
In video games, we can often see fancy light and shadow effects. Objects are not only lighted up, but are also reflecting lights to other objects. Different objects also have different light properties, metal lights are more shiny while plastic lights have more scattering. Those effects are rendered by professional lighting engines, lights are calculated in real time based on the shape of 3D models. It will be quite easy to add lighting effects if professional lighting engines can be applied to 2D pictures. 

How can we bridge the gap between 2D and 3D? 

New technologies have enable depth detection in new cellphones and cameras. Depth detection has been used for many applications such as facial detection and augmented reality. Depth map can add z-axis to 2D pictures taken by cellphones or cameras. Even though, we are not able to reconstruct entire 3D models of all objects in 2D pictures, is it possible to add lighting effects to 2D pictures by extending z variables of every pixel? 

Mostly importantly, no matter how many lighting effects are to be added to a 2D picture, we are still viewing the effects from the only one and fixed angle. Therefore, we considered the following situations.

![alt text](/images/readme/viewer1.png)
```
Lights that are vertical to the surface of screen can be seen by viewer
```
![alt text](/images/readme/viewer2.png)
```
Lights that are reflected at other angles cannot be captured by viewer
```

To conclude, only lights that is vertical to the surface of original picture can be captured by viewer. In normal situations, the generally holding fact is that lights reflected by surface that forbids light reflections vertical to the surface of picture. It does not matter if such surfaces cannot be captured by depth map. 
## Our Plan

## Turn Plane Picture to 3D Model

## Calculate Normal for Each Pixel

## Apply Shader

## Results

