# gput

super simple streaming uploads into google drive from the command line

[![NPM](https://nodei.co/npm/gput.png?mini=true)](https://nodei.co/npm/gput/)

# usage

this assumes you have a fresh google oauth token in `~/.config/googleauth.json`. If you don't, just `npm install googleauth -g` to generate one!

```
npm install gput googleauth -g
googleauth
# authenticate with google, then
gput foo.jpg
```

you can also make directories:

```
gput mkdir foo
```

it will print out a big json blob. grab the id from it and then do:

```
gput foo.jpg --dir 0B8lSLF293vHqRlVkRzJp
```

to upload `foo.jpg` into the parent directory you created

nested directories aren't yet supported
