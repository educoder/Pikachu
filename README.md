Pikachu
=======

A tiny RESTful service for uploading pictures and other media.


Deployment
----------

```
git clone git://github.com/educoder/Pikachu.git
cd Pikachu
npm install
node pikachu.js
```

Pikachu should now be running on <http://localhost:2596>.

Usage
-----

See <http://localhost:2596/upload.html> for an example of how 
to upload to Pikachu using HTML + AJAX.

All files are uploaded to Pikachu's `data` directory. Any file
in `data` is automatically served at <http://localhost:2596>. For
example `data/1234.gif` would be accessible at <http://localhost:2596/1234.gif>.

Pikachu's REST API is as follows:

#### `GET /`

Responds with a JSON array listing all files in `data`.

For example:

```json
[ 
  "14o241fsc8w.jpg", 
  "8q5u9haf40.jpg", 
  "qri7bl5clc.jpg"
]
```

#### `POST /`

Uploads a new file to the `data` directory. Expects a `multipart/form-data` request (i.e.
an HTML form submission or JavaScript [FormData](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData))
with a key (name) of `file`.

See https://github.com/educoder/Pikachu/blob/master/upload.html for a JavaScript example.

#### `GET /<filename>.<ext>`

Responds with the contents of the given filename. 

For example, `GET /14o241fsc8w.jpg` would respond with the contents of the `data/14o241fsc8w.jpg` file.
The response's MIME type is automatically resolved based on the file's extension. 
