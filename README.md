# Image Relighting
Group members: Avichal Rakesh, Jack Chen, ZhaoKun Xu, Sherry Xu

Play around with the examples at [avichalrakesh.com/image-relighting/](https://avichalrakesh.com/image-relighting/)

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
In video games, we can often see fancy light and shadow effects. Objects are lit up, have reflections, and cast shadows. Different objects also have different optical properties: light bouncing off metallic surfaces are sharper vs. light bouncing off a plastic surface, which is more difffused. These effects are rendered by shaders, which calculate lighting of a 3D modeled scene in real time. We take this concept of shaders to add lighting to a 2D image.

#### How to bridge the gap between 2D and 3D? 

 New technologies have enabled depth detection in consumer electronics. Depth detection is used for applications such as facial detection, augmented reality, and bokeh effect. This depth map is the link between 3D model, and 2D pictures taken by cellphones or cameras. Even though, we cannot to reconstruct entire 3D models of all objects from a single image, it is possible to get an idea of how far an object in the scene is from the camera. 

To apply a shader to the 3D model, we will only need to consider the light rays that intersect the screen, which in turn means we can approximate the surfaces that do not face the screen, and still get an acceptable result.

![alt text](/images/readme/viewer1.png)

`Img 1. Light rays that intersect the screen can be seen by viewer`

![alt text](/images/readme/viewer2.png)

`Img 2. Lights rays that are reflected at other angles does not reach the camera, and are not captured`

To conclude, only light rays that intersect the screen can be captured by the camera. This allows us to ignore surfaces that are at an off-angle with respect to the camera. 

For example, the back face of a cube does not have any effect on what the camera sees. So in reconstructing the 3D scene with just a cube, we can ignore the back face since it doesn't add to the lighting of the scene.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
## Our Plan
1. Build a 3D model from the 2D picture and its depth map
2. Add lighting using a shader
3. Leverage WebGL for real time rendering

## Turning 2-dimensional Picture to 3-dimensional Model
The underlying theory is the simple: for every pixel of a given picture, add one more value from corresponding position in its depth map. Then, tell webgl to render the picture to 3D model. Colors can be added by using the original picture as texture, and then binding the texture to the rendered 3D model. In order to show the effect of our 3D model. Following GIFs show the 3D model generated from images and their depth map.

![Small Bird 2D + Depthmap](/images/readme/bird-small.jpg)  ![Small Bird 3D](/images/readme/bird-3D-0.gif)

`The images above show what a 3D model recontructed from an image and its depthmap looks like. Notice that the obscured surfaces (i.e. surfaces under the bird) has very little effect on the final model.`

![alt text](/images/readme/tunnel-small.jpg)  ![alt text](/images/readme/tunnel-3D.gif)

`This example is a little more complicated, and shows some flaws of our approach. Since depthmap has limited resolution (i.e. each pixel contains only 8-bit values), we lose some details about the true depth of the scene. This is exemplified in the small tunnel (in green circle) which shows up as a very tiny bump in the 3D model, as opposed to a full tunnel.`

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
## Calculate Normal for Each Pixel

Calculating normals was done trhough first principle. Normal of a surface is the cross product of 2 non parallel vectors on the surface.


To get the normal at a pixel `p`, we chose it's 4 diagonal neighbors. Since the distance between `p` and its neighboring pixels can be assumed to be small, we can consider the neighboring pixels, and `p` to lie on the same infinitesimal plane. 

From these 5 points, we find 4 vectors, and take their cross product to find intermediate normals, and finally add them to find the surface normal at that point.

![surface normal](/images/readme/normal-illustration.gif)

`The above illustraction shows how normal v can be calculated from p's neighboring points. v1, v2, v3, v4 are the vectors from p to its neighbors. v12, v23, v34 and v41 are intermediate normals calculated by taking the cross products of v1 and v2, v2 and v3, v3 and v4, and v4 and v1 respectively. These intermediates are averaged out to obtain the final normal v of the point.`

Although our approach  of calculating normals works in most cases, it fails in the situations where distance between neighboring pixel is too large.

## Applying Shader

We chose to go with a mainstream shader to add lighting to our model. We decided to use the Blinn-Phong model. More information about the Blinn-Phong shader can be found [here](https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_shading_model).

However, the specular part of Blnn-Phong shader is sensitive to noise, so to improve the result and make the model look smoother, we removed the specular part of Blinn-Phong shader model, and only used the diffused lighting.

## Results

Following are some results of our project. Feel free to head over [here](https://avichalrakesh.com/image-relighting/), and try the examples out yourself!

#### Light in front of the bird
![original](/images/readme/bird.jpg) 

`original`

![added light](/images/readme/bird-breast-light.png) 

`relighted`

![without texture](/images/readme/bird-breast-normal.png) 

`no texture`

  - Visually similar to a small LED being placed in front of the bird.
  - Feathers on the breast of the bird are lit up.
  - There is a dark area at the connection of bird and grass, where the ground is slighly concave.
  - The back of the bird is not affected.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
#### Light behind the bird
![original](/images/readme/bird.jpg) 

`original`

![added light](/images/readme/bird-back-light.png) 

`relighted`

![without texture](/images/readme/bird-back-normal.png) 

`no texture`

  - Light comes from the back of the bird.
  - The breast of the bird is not affected.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)

#### Light on the surface of the largest coke can

![original](/images/readme/coke.jpg) 

`original`

![added light](/images/readme/coke-light.png) 

`relighted`

![without texture](/images/readme/coke-normal-graph.png) 

`no texture`

  - It looks like there is a flashlight pointing at the largest can.
  - The reflection light is also metallic.
  - However, the edges show some visual artifacts due to the quality of depth map.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)

#### Light at the right wall of the tunnel

![Tunnel Original](/images/readme/tunnel.jpg) 

`original`

![Tunnel w/ Light](/images/readme/tunnel-right-light.png) 

`relighted`

![Tunnel w/o texture](/images/readme/tunnel-normal-graph.png) 

`no texture`

  - The result was unexpectedly bad. 
  - There are many vertically flat surfaces both on the wall and on the floor. 
  - Inaccurate depth map determines the quality of construction of re-lighting effects.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
## Discussions
Our results heavily rely on the quality of depth map, mainly the noise in the depth map. Unfortunately, it is difficult to obtain a highly accurate depth map without specialized hardware. Additionally, a low quality depth map can create disastrous lighting effects. However, denoising is a powerful tool in Computer Vision, and can be carried over with little to no changes for our use case. On the flip side, a good depth map picture like the one of the bird can produce realistic results making it easier to touch up scene lighting without speding hours on a prefessional photo editing tool. 

The texture of the objects also determines how we evaluate how 'natural' the re-lighted pictures look. Bird's feather and grass are "chaotic" objects, which by nature mitigate the effects of noise. Tunnel walls and ground, however, are more uniform regions with slight and smooth "bumps", noises can therefore significantly corrupt the smoothness between lower and higher points little bumps. 

Depth map itself also limits the amount of details that can be used to re-light the image. Depth map is essentially intensity graphs where more black means closer to viewer and more white means further to viewer or vise versa. Pixel values of intensity graphs vary from 0 - 255, which is not enough to capture all information if the actual object is very deep, e.g. a tunnel. It might be sufficient for objects with small depth, such as a bird or a coke can, but may fail in larger scenes.

There are some engineering problems we haven't solved yet: 
  - Light source below surface is not blocked. If you move the light source behind the wall or underneath the grass, some lower areas will still be lighted up. 
  - Creating mesh takes a long time. A reload can take upto 10 seconds.
  - A more robust technique to calculate normals would be to take the gradient of the surface around a pixel. Although, this will make the normals more accurate, mesh generation will become more computationally intensive.

[Back to Top](https://github.com/avirakesh/image-relighting#image-relighting)
