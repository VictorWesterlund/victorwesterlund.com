<div align="center">
  <img width="100px" src="https://storage.googleapis.com/public.victorwesterlund.com/github/VictorWesterlund/victorwesterlund.com/vw.svg"/>
  <h3>Source code for <a href="https://victorwesterlund.com"><strong>victorwesterlund.com</strong></a></h3>
</div>

## Local installation

If someone for whatever reason want to set up their own environment of this. Here's how you do so assuming you have [NGINX](https://nginx.org/en/) up and running:

1. **Clone this repo**

```
git clone https://github.com/VictorWesterlund/victorwesterlund.com
```

2. **Create an NGINX site config**

   Create and enable a new site + server config with the `root` pointed to the **/public** folder inside the repo.
   
3. **Add support for `.mjs`**

   I'm using the hyped .mjs extension for the ES modules and NGINX does not serve the correct MIME-type for these yet.
   
   Open **/etc/nginx/mime.types** with your text editor of choice and add `mjs` to the `application/javascript` MIME-type. Save and exit.
   
   ```
   types {
      ...
      application/javascript          js mjs;
      ...
   }
   ```
   *Psst: if you shiver at the sight of JS using another type than your HTML:s and CSS:ess (you are my kind of nerd), replace **application/javascript** with **text/javascript** and remain [WHATWG compliant](https://mimesniff.spec.whatwg.org/#javascript-mime-type)😚*
   
4. **Fire up NGINX with the new config**

   Verify that your changes are valid and restart NGINX. Hop over to your browser and navigate to your set endpoint - fingers crossed 🤞
   ```
   nginx -t
   sudo systemctl restart nginx
   ```
