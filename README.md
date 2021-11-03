<div align="center">
  <img width="100px" src="https://storage.googleapis.com/public.victorwesterlund.com/github/VictorWesterlund/victorwesterlund.com/vw.svg"/>
  <h3><strong><code>www.victorwesterlund.com</code></strong></h3>
  <p>The source code for <a href="https://victorwesterlund.com">victorwesterlund.com</a></p>
</div>
<h1 align="center">How to install</h1>
<p>This guide is for Unix-based systems with NGINX, PHP 8.0 and MariaDB installed and configured.</p>
<ol>
  <li><strong>Clone this repo.</strong><br><pre>git clone https://github.com/VictorWesterlund/victorwesterlund.com /var/www</pre></li>
  <li><strong>Expose the directory <code>/public</code> to the web.</strong><br>This can be done in multiple ways, but an <a href="http://nginx.org/en/docs/http/ngx_http_core_module.html#location">NGINX <code>location</code> block</a> or symlink should do the trick.</li>
  <li><strong>Rewrite <code>api.php</code> to <code>api/*</code>.</strong><br>All requests to <code>example.com/api/*</code> should be routed to the PHP file at <code>/public/api.php</code>.<br>Just like the previous step, this can be done in multiple ways. Here is one way with an NGINX location block:<br>
<pre>location ~ /api/* {
     try_files /public/api.php =503;
     include snippets/fastcgi-php.local.conf;
     fastcgi_pass unix:/run/php/php8.0-fpm.sock;
}</pre></li>
  <li><strong>Add support for the <code>.mjs</code> extension.</strong><br>NGINX doesn't have an entry for the <a href="https://jakearchibald.com/2017/es-modules-in-browsers/#mime-types">ECMAScript module <i>(<code>.mjs</code>)</i></a> file extension in its default <code>/etc/nginx/mime.types</code> file. We need to add this manually:<br>
<pre>
types {
     ...
     application/javascript                js mjs;
     ...
}
</pre><i>PS: If you want to make your <code>Content-Type</code> <a href="https://html.spec.whatwg.org/multipage/scripting.html#scriptingLanguages">WG compliant</a>, replace <code>application/javascript</code> with <code>text/javascript</code></i></li>
  <li><strong>Import the standard structure to a MariaDB database.</strong><br>A MySQL-compatible <code>.sql</code> can be <a href="https://example.com">downloaded here</a> and imported into a database with this command:<br><pre>mysql -u username -p database_name < db_structure.sql</pre>You will have to create an empty database if you don't have one already.</li>
  <li><strong>Add your MariaDB connection details to <code>/src/database/config.json</code>.</strong><br>You can add as many fallback servers as you want
<pre lang="json">
{
  "servers": [
      {
         "host": "db.example.com",
         "user": "mysql_user",
         "pass": "mysql_pass",
         "db": "mysql_db"
      },
      {
         "host": "fallback.db.example.com",
         "user": "mysql_user",
         "pass": "mysql_pass",
         "db": "mysql_db"
      }
  ]
}
</pre></li>
</ol>
<p>That was a lot, but now we're done! Navigate to the location you exposed in step 2 and cross your fingers 🤞</p>
