# Madamme Amanita's Starry Night & Delight
> I like the long tongue twisting names, hi!

Chloe's personal website hosted on neocities. Much of it is excuses for me to do coding experiments for silly user interfaces and small games, as well as acting as my professional (kinda...) portfolio of my projects beyond programming.

get in there! navigate the silly buttons. have fun or something

[chloe-amanita.neocities.org/](https://chloe-amanita.neocities.org/)

---

## How I upload the files to neocities easily:
> annotated so i don't mess this up later

there is a `shell.nix` file, enter it with `$ nix-shell` - this will give access to the neocities cli tool

from here, it is already set up (I hope) so that when you git push the files to remote, it should also upload everything to the website.

alternatively, run `$ neocities push __site` to upload the whole directory

notice how the whole website is inside the `__site` directory. this was a necessary change when I added this easy uploading help because otherwise it would also upload the .git folder and unwanted stuff. 