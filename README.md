# Image-relighting
Group members: Avichal Rakesh, Jack Chen, ZhaoKun Xu, Sherry Xu

To play around with the re-lighting with the examples we provided, visit [here](https://avichalrakesh.com/image-relighting/)

#### Index
- [Goal](https://github.com/avirakesh/image-relighting#goal)
- [Inspiration](https://github.com/avirakesh/image-relighting#inspiration)
- [Our Plan](https://github.com/avirakesh/image-relighting#our-plan)
- [Turn Plane Picture to 3D Model](https://github.com/avirakesh/image-relighting#turn-plane-picture-to-3d-model)
- [Results](https://github.com/avirakesh/image-relighting#results)
  - [Bird 1](https://github.com/avirakesh/image-relighting#add-lights-at-the-front-of-the-bird)
  - [Bird 2](https://github.com/avirakesh/image-relighting#add-lights-at-the-back-of-the-bird)
  - [Coke](https://github.com/avirakesh/image-relighting#add-lights-on-the-surface-of-the-largest-coke-can)
  - [Tunnel](https://github.com/avirakesh/image-relighting#add-lights-at-the-right-wall-of-the-tunnel)
- [Discussions](https://github.com/avirakesh/image-relighting#discussions)

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
Lights that are reflected at other angles cannot reach viewer
```

To conclude, only lights that is vertical to the surface of original picture can be captured by viewer. In normal situations, the generally holding fact is that lights reflected by surface that forbids light reflections vertical to the surface of picture. It does not matter if such surfaces cannot be captured by depth map. 

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
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

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
## Calculate Normal for Each Pixel

## Apply Shader
Add a shader program is actually simple job because every WebGL application needs a shader program.
## Results
### Add lights at the front of the bird
![original](/images/readme/bird.jpg) `original`

![added light](/images/readme/bird-breast-light.png) `relighted`

![without texture](/images/readme/bird-breast-normal.png) `no texture`

Suppose a small LED is placed in front of the bird.
The furs on the breast of the bird are lighted up.
Some dark areas in at the connection between the bird and grass, which is a lower region of the grass.
The back of the bird is not affected.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
### Add lights at the back of the bird
![original](/images/readme/bird.jpg) `original`

![added light](/images/readme/bird-back-light.png) `relighted`

![without texture](/images/readme/bird-back-normal.png) `no texture`

Suppose lights come from the back of the bird.
The breast of the bird is not affected.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
### Add lights on the surface of the largest coke can
![original](/images/readme/coke.jpg) `original`

![added light](/images/readme/coke-light.png) `relighted`

![without texture](/images/readme/coke-normal-graph.png) `no texture`

It looks like there is a torch light pointing to the largest can.
The reflection light is also metal-like.
However, the edge of the can look very strange due to the quality of depth map.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
### Add lights at the right wall of the tunnel
![original](/images/readme/tunnel.jpg) `original`

![added light](/images/readme/tunnel-right-light.png) `relighted`

![without texture](/images/readme/tunnel-normal-graph.png) `no texture`

The result was unexpectedly bad. There are many squares both on the wall and on the floor. Inaccurate depth map almost determines the quality of construction of re-lighting effects.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
## Discussions
Our results heavily rely on the quality of depth map, mainly the noise in the depth map picture. It is not a good thing because it is difficult to obtain highly accurate depth map from normal equipments now. Additionally, a low quality depth map simply create disastrous lighting effects. It is also a good news because there are many mature techniques to denoise pictures. A good depth map picture like the one of the bird can produce realistic results. 

The texture of the objects may also determine how we evaluate the "realisticness" of the re-lighted pictures. Bird's furs and grass are "spiky" objects, which by their nature mitigate the effects of noises. Tunnel walls and ground are somewhat smooth regions with slight and smooth "bumps", noises can therefore significantly corrupts the smoothness between lower and higher points little bumps. 

Depth map itself also limits the amount of details that can be used to re-light the image. Depth map is essentially intensity graphs where more black means closer to viewer and more white means further to viewer or vise versa. Pixel values of intensity graphs vary from 0 - 255, which is not enough to capture all information if the actual object is very deep, e.g. a tunnel. It might be sufficient for objects with small depth, such as a bird or a coke can.

Some engineering problems we have are not yet solved. Lights below surface is not blocked. If you happen to move the light source behind the wall or underneath the grass, some lower areas will still be lighted up. Creating mesh takes a long time. Each reload needs 5 - 7 seconds. This may be upsetting our graders if they want to play around with our demo website [here](https://avichalrakesh.com/image-relighting/)

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
