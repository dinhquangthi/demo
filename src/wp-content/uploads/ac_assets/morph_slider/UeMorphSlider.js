import { Renderer, Camera, Program, Transform, Plane, Mesh, Texture } from './vendor/ogl/src/index.js';
import anime from './vendor/animejs/anime.es.js';

class UeMorphSliderBase {
    constructor (options){
        this.dom = options.dom
        this.container = options.container
		this.imageContainer = options.imageContainer
		this.objContainer = jQuery(this.dom);
        this.images = options.sliderImages
		if (options.navExist) {
          this.navExist = options.navExist
          this.navPrevious = options.navPrevious
          this.navNext = options.navNext
		}
        this.fragment = options.fragment
        this.uniforms = options.uniforms
        this.isAutoplay = options.autoplay
        this.transitionDelay = options.transitionDelay
        this.transitionDuration = options.transitionDuration
        this.distort = options.distort
		this.cover = options.cover

        this.textures = []
        this.state = {
            isAnimating: false,
            currentTextureIndex: 0,
            currentTexture: null,
            nextTextureIndex: 1,
            nextTexture: null,
			remoteIndex: 0
        }

        this.canvasSize = {
            width: this.imageContainer.width < this.container.clientWidth ? this.imageContainer.width : this.container.clientWidth,
            height: this.imageContainer.height 
        }

        this.viewPort = {
            width: 0,
            height: 0
        }

        this.vertex = `
            precision mediump float;

            attribute vec3 position;
            attribute vec2 uv;
            
            varying vec2 vUV;
            
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform float uAmplitude;
            uniform bool uAnimating;
            uniform float uProgress;
            uniform bool uDistort;
            uniform float uDistortion;
            
            void main() {
                vUV = uv;
                vec3 pos = position;
                if ( uAnimating) {

                    if ( uDistort ) {
                            
                        if ( uDistortion == 0.) {
                            pos.z = sin(-pos.x*5.+uProgress*5.)* uAmplitude;
                        } else if ( uDistortion == 1. ) {
                            pos.z = sin(pos.x*5.+uProgress*5.)*uAmplitude;
                        } else if ( uDistortion == 2. ) {
                            pos.z = sin(pos.y*5.+uProgress*5.)*uAmplitude;
                        } else if ( uDistortion == 3. ) {
                            pos.z = sin(-pos.y*5.+uProgress*5.)*uAmplitude;
                        } else if ( uDistortion == 4. ) {
                            float distance = length(uv - vec2(0.5));
                            float maxDistance = length(vec2(0.5));
                            float normalizedDistance = distance/maxDistance;
                            pos.z = sin( -normalizedDistance * 5. + 5. * uProgress ) * uAmplitude ;
                        } 
            
                    }
                }
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `
    }

    createRenderer() {
        this.renderer = new Renderer({
            antialias: true,
            alpha: true,
            dpr: Math.min(window.devicePixelRatio, 2)
        })
        this.gl = this.renderer.gl;
        this.canvas = this.container.appendChild(this.gl.canvas)
    }

    createCamera() {
        this.camera = new Camera(this.gl,{
            fov: 35
        })
        this.camera.position.set(0, 0, 5)
        this.camera.lookAt([0, 0, 0])
    }

    createScene() {
        this.scene = new Transform()
    }

    createGeometry() {
        this.geometry = new Plane(this.gl, {
            heightSegments: 30,
            widthSegments: 30
        })
    }

    createProgram() {
        this.program = new Program(this.gl, {
            vertex: this.vertex,
            fragment: this.fragment,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            uniforms: this.uniforms
        })
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
          geometry: this.geometry,
          program: this.program
        })
        this.mesh.setParent(this.scene)
    }

    loadTexture(url, index) {
        return new Promise( resolve => {
            const image = new Image()
            image.src = url
            image.onload = () => {
                this.textures[index] = {
                    texture: new Texture(this.gl, {
                        image: image,
                        generateMipmaps: false,
						width: image.naturalWidth,
                        height: image.naturalHeight
                    }),
                }
                if ( index === 0 ) {
                    this.state.currentTexture = this.textures[index].texture
                    this.uniforms.uCurrentTexture.value = this.state.currentTexture
                }
                if ( index === 1 ) {
                    this.state.nextTexture = this.textures[index].texture
					this.imageSize = { width: image.naturalWidth, height: image.naturalHeight }
                    this.uniforms.uImageSize.value = [this.imageSize.width, this.imageSize.height]
                    this.uniforms.uNextTexture.value = this.state.nextTexture
                    this.uniforms.uAnimating.value = this.state.isAnimating
                }
                resolve()
            }
        })
        
    }

    loadTextures() {
        return new Promise(resolve => {
            const promises = []
            this.images.forEach( (image, index) => {
                promises.push(this.loadTexture(image, index))
            })
            Promise.all(promises).then( () => resolve() )
        })
    }

    setScale() {
        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect
        if ( this.distort) {
            this.mesh.scale.x = width * 0.9
            this.mesh.scale.y = height * 0.9
        } else {
            this.mesh.scale.x = width 
            this.mesh.scale.y = height
        }
        this.program.uniforms.uPlaneSize.value = [this.mesh.scale.x, this.mesh.scale.y]
    }

    render() {
      this.renderer.render({
        camera: this.camera,
        scene: this.scene
      })
		requestAnimationFrame(this.render.bind(this));
    }

    /*
    ** @params: {number} direction - Values: 1 for next slide, -1 for previous slide
     */
    animateSlide(direction, jumpToIndex){
    	
        if(this.state.isAnimating) return

		if(!jumpToIndex) {
		
		  this.state.nextTextureIndex = this.state.currentTextureIndex + direction

          if(this.state.nextTextureIndex < 0 ) {
              this.state.nextTextureIndex = this.textures.length - 1
          }

          if(this.state.nextTextureIndex >= this.textures.length) {
              this.state.nextTextureIndex = 0
          }
	
		}
		
		this.state.nextTexture = this.textures[this.state.nextTextureIndex].texture
		this.program.uniforms.uNextTexture.value = this.state.nextTexture

		this.state.remoteIndex = this.state.nextTextureIndex
		this.objContainer.trigger("uc_change");

        anime.timeline({
            duration: this.transitionDuration,
			begin: () => {
				this.state.isAnimating = true
                this.program.uniforms.uAnimating.value = this.state.isAnimating
			},
            complete: () => {
				this.state.isAnimating = false
                this.program.uniforms.uAnimating.value = this.state.isAnimating
                this.program.uniforms.uProgress.value = 0
                this.state.currentTexture = this.state.nextTexture
                this.program.uniforms.uCurrentTexture.value = this.state.currentTexture
                this.state.currentTextureIndex = this.state.nextTextureIndex
            }
        })
        .add({
            targets: this.program.uniforms.uProgress, 
            value: 1,
            easing: 'easeOutSine',
            
        })
        
        .add({
            targets: this.program.uniforms.uAmplitude, 
            value: 0.5,
            duration: this.transitionDuration / 2,
            easing: 'easeOutSine'
        }, 0)
        .add({
            targets: this.program.uniforms.uAmplitude, 
            value: 0,
            duration: this.transitionDuration / 2,
            easing: 'easeOutSine'
        }, this.transitionDuration / 2)
        
    }

    autoplay() {
        this.intervalID = setInterval( () => {
            this.animateSlide(1, false)
        }, this.transitionDelay)
    }

    onResize() {
        this.canvasSize = {
            width: this.imageContainer.width < this.container.clientWidth ? this.imageContainer.width : this.container.clientWidth,
            height: this.imageContainer.height
        }

        this.renderer.setSize(this.canvasSize.width, this.canvasSize.height)

        this.camera.perspective({ 
            aspect: this.canvasSize.width / this.canvasSize.height 
        })

        this.setScale()
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this), false)
        new ResizeObserver( () => this.onResize()).observe(this.dom.closest('.elementor-column'))
		if (this.navExist) {
            this.navNext.addEventListener('click', () => {
                    this.animateSlide(1, false)
                }, { passive: true }
            )
            this.navNext.addEventListener('keypress', (e) => {
                if (e.key === 'Enter'){
                    this.animateSlide(1, false)
                }
            }, { passive: true }
   			)

			this.navPrevious.addEventListener('click', () => {
                    this.animateSlide(-1, false)
                }, { passive: true }
            )
            this.navPrevious.addEventListener('keypress', (e) => {
                if (e.key === 'Enter'){
                    this.animateSlide(-1, false)
                }
            }, { passive: true }
   			)
		}

		this.initRemoteConnection();
        
    }

	remoteDoAction(action, arg1, arg2){

    	switch(action){
	    	case "get_total_items":
	    		return this.textures.length
	    		break;
	    	case "get_num_current":
	    		return this.state.remoteIndex
	    		break;
	    	case "change_item":	
				if ( this.state.remoteIndex !== arg1 ) {
                  this.state.nextTextureIndex = this.state.remoteIndex = arg1;
                  this.animateSlide(0, true)
				}
	    		break;
	    	default:
	    		throw new Error("Wrong action: "+action);
	    	break;
    	}
    }

	initRemoteConnection(){
    	
        var ueRemoteAPIOptions = {
   			connect_type:"events",
   			func_doAction:this.remoteDoAction.bind(this)
        };
        
	   this.objContainer.data("uc-remote-options",ueRemoteAPIOptions);
       this.objContainer.trigger("uc-object-ready");
       jQuery("body").trigger("uc-remote-parent-init", [this.objContainer]);
    	    	
    }
    
        
}


class UeMorphSliderBlend extends UeMorphSliderBase {
    constructor(options) {
        super(options)
        this.options = options
        this.init()
    }

    init()  {
        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.loadTextures().then( () =>{
            this.run()
            this.initEventListeners()
        })
    }

    run() {
    	
        this.createProgram()
        this.createGeometry()
        this.createMesh()
		this.onResize()
        this.render()
        if (this.options.autoplay) {
            this.autoplay()
        }
    }
}

class UeMorphSliderDisplacement extends UeMorphSliderBase {
    constructor(options) {
        super(options)
        this.options = options
        this.init()
    }

    loadDisplacement() {
        return new Promise( resolve => {
            const image = new Image()
            image.src = this.options.displacementImage
            image.onload = () => {
                this.displacementTexture = new Texture(this.gl, {
                    image: image,
                    generateMipmaps: false,
                    width: image.naturalWidth,
                    height: image.naturalHeight
                })
                resolve()
            }
        })
    }

    init()  {
        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.loadTextures().then( () =>{
            this.loadDisplacement().then( () =>{
                this.uniforms.uDisplacementTexture.value = this.displacementTexture
                this.run()
                this.initEventListeners()
            })
        })
    }

    run()  {
        this.createProgram()
        this.createGeometry()
        this.createMesh()
		this.onResize()
        this.render()
        if (this.options.autoplay) {
            this.autoplay()
        }
    }
}

class UeMorphSliderNoise extends UeMorphSliderBase {
    constructor(options) {
        super(options)
        this.options = options
        this.init()
    }

    init()  {
        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.loadTextures().then( () =>{
            this.run()
            this.initEventListeners()
        })
    }

    run() {
        this.createProgram()
        this.createGeometry()
        this.createMesh()
		this.onResize()
        this.render()
        if (this.options.autoplay) {
            this.autoplay()
        }
    }
}

class UeMorphSliderColorMix extends UeMorphSliderBase {
    constructor(options) {
        super(options)
        this.options = options
        this.init()
    }

    init()  {
        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.loadTextures().then( () =>{
            this.run()
            this.initEventListeners()
        })
    }

    run() {
        this.createProgram()
        this.createGeometry()
        this.createMesh()
		this.onResize()
        this.render()
        if (this.options.autoplay) {
            this.autoplay()
        }
    }
}

class UeMorphSlider {
    constructor(options) {
        this.options = options

        switch (this.options.transitionType) {
            case 'blend':
                this.initBlendSlider()
                break;
            case 'displacement':
                this.initDisplacementSlider()
                break;
            case 'noise':
                this.initNoiseSlider()
                break;
			case 'color_mix':
                this.initColorMixSlider()
                break;
            default:
                console.error('Invalid transition type: ', this.options.transitionType)
                break;
        }
    }

    initBlendSlider() {
        const fragment = `
        precision mediump float;

        varying vec2 vUV;

        uniform vec2 uImageSize;
        uniform vec2 uPlaneSize;
        uniform float uProgress;
        uniform sampler2D uCurrentTexture;
        uniform sampler2D uNextTexture;
        uniform float uTransition;
        uniform bool uCover;

        void main() {

            vec2 uv = vUV;

            if ( uCover) {
                vec2 ratio = vec2(
                    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
                    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
                );
                
                uv = vec2(
                    vUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
                    vUV.y * ratio.y + (1.0 - ratio.y) * 0.5
                );
            }

            float rise = 1.;
            if (uTransition == 0.) {
                rise = pow(abs(smoothstep(0., 1., ( uProgress * 2.0 - uv.x + 0.5))), 10.) ;
            } else if (uTransition == 1.) {
                rise = pow(abs(smoothstep(0., 1., ( uProgress * 2.0 + uv.x - 0.5))), 10.) ;
            } else if (uTransition == 2.) {
                rise = pow(abs(smoothstep(0., 1., ( uProgress * 2. + uv.y - 0.5))), 10.) ;
            } else if (uTransition == 3.) {
                rise = pow(abs(smoothstep(0., 1., ( uProgress * 2.0 - uv.y + 0.5))), 10.)  ;
            } else if (uTransition == 4.) {
                vec2 center = vec2(0.5);
                float width = 0.35;
                float radius = 0.9;
                float dist = distance(center, uv);
                float circle = 1.0 - smoothstep(-width, 0.0, radius * dist - uProgress * ( 1.0 + width));
                rise = pow(abs(circle), 1.0);
            }
            
            vec4 currentTexture = texture2D(uCurrentTexture, ( uv - 0.5) * (1.0 - rise) + 0.5);
            vec4 nextTexture = texture2D(uNextTexture, ( uv - 0.5 ) * rise + 0.5);

            gl_FragColor = mix(currentTexture, nextTexture, rise);

        }
        `
        const uniforms = {
            uPlaneSize: { value: [0, 0] },
            uImageSize: { value: [0, 0] },
            uCurrentTexture: {value: 0 },
            uNextTexture: { value: 0},
            uCover: {value: this.options.cover},
            uAnimating: {value: 0 },
            uProgress: {value: 0 },
            uTransition: {value: this.options.blendEffect},
            uAmplitude: { value: 0},
            uDistort: {value: this.options.distort},
            uDistortion: {value: this.options.distortionEffect},
        }
        const options = {...this.options}
        options.uniforms = uniforms
        options.fragment = fragment

        this.instance = new UeMorphSliderBlend(options)
    }

    initDisplacementSlider () {
        const fragment = `
        precision mediump float;

        varying vec2 vUV;

        uniform vec2 uImageSize;
        uniform vec2 uPlaneSize;
        uniform float uProgress;
        uniform sampler2D uCurrentTexture;
        uniform sampler2D uNextTexture;
        uniform sampler2D uDisplacementTexture;
        uniform float uEffectFactor;
        uniform float uTransitionDirection;
        uniform bool uCover;

        void main() {

            vec2 uv = vUV;

            if ( uCover) {
                vec2 ratio = vec2(
                    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
                    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
                );
                
                uv = vec2(
                    vUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
                    vUV.y * ratio.y + (1.0 - ratio.y) * 0.5
                );
            }

            vec4 displacementTexture = texture2D(uDisplacementTexture, uv);
            vec2 distortedUv1 = vec2(0.);
            vec2 distortedUv2 = vec2(0.);

            if ( uTransitionDirection == 0.) {
                distortedUv1 = vec2(uv.x + uProgress * (displacementTexture.r*uEffectFactor), uv.y);
                distortedUv2 = vec2(uv.x - (1.0 - uProgress) * (displacementTexture.r*uEffectFactor), uv.y);
            } else if (uTransitionDirection == 1. ) {
                distortedUv1 = vec2(uv.x - uProgress * (displacementTexture.r*uEffectFactor), uv.y);
                distortedUv2 = vec2(uv.x + (1.0 - uProgress) * (displacementTexture.r*uEffectFactor), uv.y);
            } else if (uTransitionDirection == 2. ) {
                distortedUv1 = vec2(uv.x, uv.y - uProgress * (displacementTexture.r*uEffectFactor) );
                distortedUv2 = vec2(uv.x, uv.y + (1.0 - uProgress) * (displacementTexture.r*uEffectFactor) );
            } else if (uTransitionDirection == 3. ) {
                distortedUv1 = vec2(uv.x, uv.y + uProgress * (displacementTexture.r*uEffectFactor) );
                distortedUv2 = vec2(uv.x, uv.y - (1.0 - uProgress) * (displacementTexture.r*uEffectFactor) );
            } 
            
            vec4 currentTexture = texture2D(uCurrentTexture, distortedUv1);
            vec4 nextTexture = texture2D(uNextTexture, distortedUv2);

            gl_FragColor = mix(currentTexture, nextTexture, uProgress);

        }
        `

        const uniforms = {
            uPlaneSize: { value: [0, 0] },
            uImageSize: { value: [0, 0] },
            uCurrentTexture: {value: 0 },
            uNextTexture: { value: 0 },
            uCover: {value: this.options.cover},
            uDisplacementTexture: {value: 0},
            uAnimating: {value: 0},
            uProgress: {value: 0 },
            uEffectFactor: {value: 1},
            uTransitionDirection: {value: this.options.transitionDirection},
            uAmplitude: { value: 0},
            uDistort: {value: this.options.distort},
            uDistortion: {value: this.options.distortionEffect},
        }
        const options = {...this.options}
        options.uniforms = uniforms
        options.fragment = fragment
        this.instance = new UeMorphSliderDisplacement(options)
    }

    initNoiseSlider() {
        const fragment = `
            precision mediump float;
                
            varying vec2 vUV;

            uniform vec2 uImageSize;
            uniform vec2 uPlaneSize;
            uniform float uTime;
            uniform float uProgress;
            uniform sampler2D uCurrentTexture;
            uniform sampler2D uNextTexture;
            uniform float uTransition;
            uniform float uScale; 
            uniform float uSmoothness; 
            uniform bool uCover;

            // credits: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
            float rand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }
            
            float noise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                
                float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;
            }

            void main()  {

                vec2 uv = vUV;

                if ( uCover) {
                    vec2 ratio = vec2(
                        min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
                        min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
                    );
                    
                    uv = vec2(
                        vUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        vUV.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );
                }

                vec4 currentTexture = texture2D(uCurrentTexture, uv);
                vec4 nextTexture = texture2D(uNextTexture, uv);

                float noise = noise(uv * uScale);
                
                float p = mix(-uSmoothness, 1.0 + uSmoothness, uProgress);
                float lower = p - uSmoothness;
                float higher = p + uSmoothness;
                
                float q = smoothstep(lower, higher, noise);
                
                gl_FragColor = mix(currentTexture, nextTexture, 1.0 - q);
                
            }
        `
        const uniforms = {
            uPlaneSize: { value: [0, 0] },
            uImageSize: { value: [0, 0] },
            uCurrentTexture: {value: 0 },
            uNextTexture: { value: 0 },
            uCover: {value: this.options.cover},
            uAnimating: {value: 0},
            uProgress: {value: 0 },
            uScale: {value: this.options.noiseScale},
            uSmoothness: {value: this.options.noiseSmoothness},
            uAmplitude: { value: 0},
            uDistort: {value: this.options.distort},
            uDistortion: {value: this.options.distortionEffect},
        }
        const options = {...this.options}
        options.uniforms = uniforms
        options.fragment = fragment
        this.instance = new UeMorphSliderNoise(options)
    }

	initColorMixSlider() {
        const fragment = `
        precision mediump float;

        varying vec2 vUV;

        uniform vec2 uImageSize;
        uniform vec2 uPlaneSize;
        uniform float uProgress;
        uniform sampler2D uCurrentTexture;
        uniform sampler2D uNextTexture;
        uniform bool uCover;

        void main() {

            vec2 uv = vUV;

            if ( uCover) {
                vec2 ratio = vec2(
                    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
                    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
                );
                
                uv = vec2(
                    vUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
                    vUV.y * ratio.y + (1.0 - ratio.y) * 0.5
                );
            }
            
            vec4 currentTexture = texture2D(uCurrentTexture, uv);
            vec4 nextTexture = texture2D(uNextTexture, uv);

			float colorDistance = distance(currentTexture, nextTexture) * .5;

			float progressStep = step(colorDistance, uProgress);
                
			gl_FragColor = mix(
            	mix(currentTexture, nextTexture, progressStep), 
                nextTexture, 
                progressStep
			);

        }
        `

        const uniforms = {
            uPlaneSize: { value: [0, 0] },
            uImageSize: { value: [0, 0] },
            uCurrentTexture: {value: 0 },
            uNextTexture: { value: 0 },
            uCover: {value: this.options.cover},
            uAnimating: {value: 0},
            uProgress: {value: 0 },
            uAmplitude: { value: 0},
            uDistort: {value: this.options.distort},
            uDistortion: {value: this.options.distortionEffect},
        }
        const options = {...this.options}
        options.uniforms = uniforms
        options.fragment = fragment
        this.instance = new UeMorphSliderColorMix(options)
    }
}

export { UeMorphSlider as UeMorphSlider }