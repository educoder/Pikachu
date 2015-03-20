Pikachu
=======

A tiny RESTful service for uploading pictures and other media.


Deployment
----------

```
git clone git://github.com/educoder/Pikachu.git
cd Pikachu
npm install
node app.js
```

Pikachu should now be running on <http://localhost:2596>.

Usage
-----

See <http://localhost:2596/upload.html> for an example of how
to upload to Pikachu using HTML + AJAX.

All files are uploaded to Pikachu's `public` directory. Any file
in `public` is automatically served at <http://localhost:2596>. For
example `public/1234.gif` would be accessible at <http://localhost:2596/1234.gif>.

Pikachu's REST API is as follows:

#### `GET /`

Responds with a JSON array listing all files in `public`.

For example:

```json
[
  "14o241fsc8w.jpg",
  "8q5u9haf40.jpg",
  "qri7bl5clc.jpg"
]
```

#### `POST /`

Uploads a new file to the `public` directory. Expects a `multipart/form-data` request (i.e.
an HTML form submission or JavaScript [FormData](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData))
with a key (name) of `file`.

Responds with JSON. If the upload fails, you'll get a 5xx or 4xx status code and an error object like:

```json
{
  "errno":3,
  "code":"EACCES",
  "path":"/tmp/3b328623fa95f311a3389df247eaa164.jpg"
}
```

If it succeeds, you'll get a 2xx status code and a body with something like:

```json
{
  "url":"2fr2ursgglc.jpg",
  "size":31511,
  "type":"image/jpeg"
}
```

See https://github.com/educoder/Pikachu/blob/master/upload.html for a JavaScript example.

#### `GET /<filename>.<ext>`

Responds with the contents of the given filename.

For example, `GET /14o241fsc8w.jpg` would respond with the contents of the `public/14o241fsc8w.jpg` file.
The response's MIME type is automatically resolved based on the file's extension.
