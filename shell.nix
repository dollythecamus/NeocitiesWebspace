{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
    buildInputs = [
        pkgs.neocities
    ];

    shellHook = ''
        echo "hiii :3 !!! updating neocities"
        sh ./upload.sh
    '';
}