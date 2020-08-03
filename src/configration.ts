import {  workspace, window} from 'vscode';
/**
 * 获取配置信息
 */
export class Config {
    private _path: string;
    public resolution: string | undefined;
    public BOXrun: string|undefined;
    public DOSemu: string|undefined;
    public savefirst: boolean|undefined;
    public MASMorTASM: string | undefined;
    constructor(extpath?:string) {
        this.resolution = workspace.getConfiguration('masmtasm.dosbox').get('CustomResolution');
        this.MASMorTASM= workspace.getConfiguration('masmtasm.ASM').get('MASMorTASM');
        this.DOSemu= workspace.getConfiguration('masmtasm.emu').get('emulator');
        this.savefirst= workspace.getConfiguration('masmtasm.emu').get('savefirst');
        let confboxrun=workspace.getConfiguration('masmtasm.dosbox').get('run');
        let configtoolpath:string|undefined=workspace.getConfiguration('masmtasm.ASM').get('toolspath');
        if (process.platform!='win32')   this.DOSemu='dosbox'//在linux下无法使用msdos只使用dosbox
            switch(confboxrun){
                case "keep":this.BOXrun='k';break;
                case "exit after run":this.BOXrun='e';break;
                case "pause then exit after run":this.BOXrun='p';break;
            }
            if (configtoolpath){
                this._path=configtoolpath.toString().replace(/\\/g, '/');}
                else if(extpath){
                    if(process.platform=='win32') this._path=extpath+'\\tools'
                    else this._path=extpath+'/tools'
                }
                else {
                window.showInformationMessage('未设置汇编工具路径请在设置中添加相关设置');
                throw new Error("no tools please add your tool in settings");
                }
    }
    public get path(): string{
        return this._path;
    }
}