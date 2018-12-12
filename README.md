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
1. Build a 3D model for 2D picture based on its depth map
2. Add lighting effects using a shader
3. Leverage WebGL for real time rendering
## Turn Plane Picture to 3D Model
The underlying theory is the simple: for every pixel of a given picture, add one more value from corresponding position in its depth map. Then, tell webgl to render the picture to 3D model. Colors can be added by using the original picture as texture, and then binding the texture to the rendered 3D model. In order to show the effect of our 3D model, we also implemented a demo where the 3D model can rotate.

![alt text](/images/readme/bird-small.jpg)  ![alt text](/images/readme/bird-3D-0.gif)
```
We can see in a simple situation, depth map can capture the real objects' shapes in a picture. 
The little bird is sitting on the grass. 
We can easily refer that the part of bird's body underneath the surface of grass can barely be seen even in reality. 
```
![alt text](/images/readme/tunnel-small.jpg)  ![alt text](/images/readme/tunnel-3D.gif)
```
In a more complicated situation, depth map cannot capture details that is too small or too far away. 
The second tunnel that is far away has a small depth (circled in green), 
which is very different from the reality.
```
## Calculate Normal for Each Pixel

## Apply Shader

## Results

