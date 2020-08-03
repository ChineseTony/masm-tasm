import { Uri,FileSystem, OutputChannel,workspace, window, DiagnosticSeverity} from 'vscode'
import { TextEncoder } from 'util'
import { Config } from './configration'
import {exec,execSync} from 'child_process'
import { landiagnose } from './diagnose'
export class DOSBox{
    private _OutChannel:OutputChannel
    constructor(Channel:OutputChannel,conf:Config){
        this._OutChannel=Channel
        this.writeBoxconfig(conf,undefined,true)
    }
    /**打开dosbox,操作文件
     * @param conf 配置文件
     * @param more 需要执行的额外命令
     * @param cleancopy 为true将MASM和TASM都挂载到path中，并删除T.*复制相应文件到此处
     */
    public openDOSBox(conf:Config,more:string,cleancopy?:boolean,diag?:landiagnose) {
        let filename=window.activeTextEditor?.document.fileName
        if (filename){
            let boxparam=more.replace(/\n/g,'"-c "')
            let boxcommand='-c "'+boxparam+'"'
            if(process.platform=='win32'){
                let wincommand='start/min/wait "" "dosbox/dosbox.exe" -conf "dosbox/VSC-ExtUse.conf" '
                if(cleancopy) wincommand='del/Q work\\t*.* & copy "'+filename+'" work\\T.ASM &'+wincommand
                exec(wincommand+boxcommand,{cwd:conf.path,shell:'cmd.exe'})
            }
            else{
                let linuxcommand='dosbox -conf "dosbox/VSC-ExtUse.conf" '
                if(cleancopy) linuxcommand='if [ -d work ]; then rm work/*; else mkdir work; fi; cp "'+filename+'" work/T.ASM;'+linuxcommand
                exec(linuxcommand+boxcommand,{cwd:conf.path})
            }
            if(diag) this.BOXdiag(conf,diag)
            this._OutChannel.appendLine("已打开DOSBox，并配置汇编环境")  
    }}
    private BOXdiag(conf:Config,diag:landiagnose):string{
        let info:string=' ',content
        let infouri=Uri.joinPath(conf.toolsUri, './work/T.TXT');
        let turi=window.activeTextEditor?.document.uri
        let texturi:Uri
        if (turi) {
            texturi=turi
            workspace.fs.readFile(infouri).then(
            (text)=>{
                info=text.toString()
                workspace.fs.readFile(texturi).then(
                    (text)=>{
                        content=text.toString()
                        diag.ErrMsgProcess(content,info,texturi,conf.MASMorTASM)
                    }
                )
            },
            ()=>{console.log(infouri,'readfailed')}
        )}
        return info
    }
    private writeBoxconfig(conf:Config,autoExec?: string,bothtool?:boolean)
    {
        let fs: FileSystem = workspace.fs;
        let configUri=Uri.joinPath(conf.toolsUri,'./dosbox/VSC-ExtUse.conf');
        let workpath=Uri.joinPath(conf.toolsUri,'./work/');
        let Pathadd=' '
        if (bothtool) Pathadd='set PATH=c:\\tasm;c:\\masm'
        let configContent = `[sdl]
windowresolution=${conf.resolution}
output=opengl
[autoexec]
mount c "${conf.path}"
mount d "${workpath.fsPath}"
d:
${Pathadd}`;
        if (autoExec) configContent=configContent+'\n'+autoExec
        fs.writeFile(configUri, new TextEncoder().encode(configContent));
    }
}



