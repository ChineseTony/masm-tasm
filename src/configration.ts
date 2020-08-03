import {  workspace, window} from 'vscode';
/**
 * 获取配置信息
 */
export class Config {
    private _path: string
    private BOXrun: string|undefined
    public DOSemu: string|undefined
    public resolution: string | undefined
    public savefirst: boolean|undefined
    public MASMorTASM: string | undefined
    constructor(extpath?:string) {
        this.resolution = workspace.getConfiguration('masmtasm.dosbox').get('CustomResolution');
        this.MASMorTASM= workspace.getConfiguration('masmtasm.ASM').get('MASMorTASM');
        this.DOSemu= workspace.getConfiguration('masmtasm.emu').get('emulator');
        this.savefirst= workspace.getConfiguration('masmtasm.emu').get('savefirst');
        this.BOXrun=workspace.getConfiguration('masmtasm.dosbox').get('run');
        let configtoolpath:string|undefined=workspace.getConfiguration('masmtasm.ASM').get('toolspath');
        if (process.platform!='win32')   this.DOSemu='dosbox'//在linux下无法使用msdos只使用dosbox
            if (configtoolpath){
                this._path=configtoolpath.replace(/\\/g, '/');}
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
    public boxruncmd():string{
        let command:string=' '
        switch(this.BOXrun){
            case "keep":command=' ';break;
            case "exit after run":command='exit';break;
            case "pause then exit after run":command='pause \r\n exit';break
        }
        return command
    }
    public boxrunbat():string{
        let param:string=' '
        switch(this.BOXrun){
            case "keep":param='k';break;
            case "exit after run":param='e';break;
            case "pause then exit after run":param='p';break
        }
        return param
    }
}