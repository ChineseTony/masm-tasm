import { FileSystem, Uri, workspace, window } from 'vscode';
import { TextEncoder } from 'util';
export class Config {
    private readonly _fs: FileSystem;
    private  _configUri: Uri;
    private _path: string | null | undefined;
    private _resolution: string | undefined;
    public MASMorTASM: string | undefined;
    public BOXrun: string|undefined;
    public DOSemu: boolean|undefined;
    constructor() {
        this._fs = workspace.fs;
        this._resolution = workspace.getConfiguration('masmtasm.dosbox').get('CustomResolution');
        this.MASMorTASM= workspace.getConfiguration('masmtasm.ASM').get('MASMorTASM');
        this.DOSemu= workspace.getConfiguration('masmtasm.ASM').get('emulator');
        let confboxrun=workspace.getConfiguration('masmtasm.dosbox').get('run');
        let configtoolpath:string|undefined=workspace.getConfiguration('masmtasm.ASM').get('toolspath');
        switch(confboxrun){
            case "keep":this.BOXrun=' ';break;
            case "exit after run":this.BOXrun=' exit ';break;
            case "pause then exit after run":this.BOXrun='pause \n exit';break;
        }
        if (configtoolpath){
            this._path=configtoolpath.toString().replace(/\\/g, '/');}
        else {
            window.showInformationMessage('未设置汇编工具路径请在设置中添加相关设置');
            throw new Error("no tools please add your tool in settings");
            
            }
        this._configUri = Uri.parse('file:///' + this._path + '/dosbox/VSC-ExtUse.conf');
    }
    public writeConfig(autoExec: string,bothtool:boolean) {
        let Pathadd=this.MASMorTASM
        if (bothtool==true){Pathadd='tasm;c:\\masm'}
        const configContent = `[sdl]
windowresolution=${this._resolution}
output=opengl
[autoexec]
mount c ${this._path}
mount d ${this._path}\\work
set PATH=c:\\${Pathadd}
d:
${autoExec}`;
        this._fs.writeFile(this._configUri, new TextEncoder().encode(configContent));
    }

    public get path(): string | undefined | null {
        return this._path;
    }
}