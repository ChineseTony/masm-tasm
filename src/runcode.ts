import * as vscode from 'vscode'
import {Config} from './configration'
import {DOSBox} from './DOSBox'
import { MSDOSplayer } from './MSDOS-player'
import { landiagnose } from './diagnose';
export class runcode{
    private readonly extOutChannel: vscode.OutputChannel;
    private readonly extpath:string
    private _config:Config
    private msdosplayer:MSDOSplayer
    private dosbox: DOSBox
    private landiag:landiagnose
    constructor(content: vscode.ExtensionContext) {
        this.extpath = content.extensionPath
        this.extOutChannel = vscode.window.createOutputChannel('Masm-Tasm');
        this._config=new  Config(this.extpath);
        this.msdosplayer=new MSDOSplayer(this.extOutChannel,this.extpath)
        this.dosbox=new DOSBox(this.extOutChannel,this._config)
        this.landiag=new landiagnose(this.extOutChannel)
    }
    private Openemu(){
        this.extOutChannel.appendLine('MASM/TASM>>打开DOSBox');
        this.dosbox.openDOSBox(this._config,' ',true)
    }
    /**运行汇编代码的入口
     * 获取拓展的设置，并执行相应操作
     */
    private Run(){
        this.extOutChannel.appendLine(this._config.MASMorTASM+'('+this._config.DOSemu+')>>运行');
        switch(this._config.DOSemu){
            case 'msdos player': this.msdosplayer.PlayerASM(this._config,true,true,this.landiag);break;
            case 'dosbox':
                let text='c:\\dosbox\\boxasm.bat '+this._config.MASMorTASM+' run '+this._config.boxrunbat
                this.dosbox.openDOSBox(this._config,text,true,this.landiag)
                break;
            case 'auto': this.msdosplayer.PlayerASM(this._config,true,false,this.landiag);break;
            default: throw new Error("未指定emulator");  
        }
    }
    /**调试程序
     * 获取拓展的设置并执行相应操作
     */
    private Debug(){
        this.extOutChannel.appendLine(this._config.MASMorTASM+'('+this._config.DOSemu+')>>调试');
        if (this._config.DOSemu=='msdos player' && this._config.MASMorTASM=='MASM'){
            this.msdosplayer.PlayerASM(this._config,false,true,this.landiag)
        }
        else if (this._config.DOSemu=='auto')
        {
            let inplayer:boolean=false
            if (this._config.MASMorTASM=='MASM') inplayer=true
            this.msdosplayer.PlayerASM(this._config,false,inplayer,this.landiag)
        }
        else{
            let text='c:\\dosbox\\boxasm.bat '+this._config.MASMorTASM+' debug'
            this.dosbox.openDOSBox(this._config,text,true,this.landiag)
        }
    }
    public cleanalldiagnose(){
        this.landiag.cleandiagnose('both')
    }
    deactivate() {
        this.extOutChannel.dispose();
    }
    /**更新设置，根据设置保存编辑器文件
     **/
    public runcode(command:string){
        this._config=new Config(this.extpath)
        if (this._config.savefirst && vscode.window.activeTextEditor?.document.isDirty) {
            vscode.window.activeTextEditor?.document.save().then(()=>this.asmit(command))  
        }
        else this.asmit(command)
    }
    private asmit(command:string){
        switch (command){
            case 'opendosbox':this.Openemu();break
            case 'run':this.Run();break
            case 'debug':this.Debug();break
        }  
    }
}