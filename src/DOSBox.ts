import { Uri,FileSystem, OutputChannel,workspace, window, DiagnosticSeverity} from 'vscode'
import { TextEncoder } from 'util'
import { Config } from './configration'
import {exec,execSync} from 'child_process'
import { landiagnose } from './diagnose'
export class DOSBox{
    private _OutChannel:OutputChannel
    constructor(Channel:OutputChannel){
        this._OutChannel=Channel
    }
    /**打开dosbox,操作文件
     * @param conf 配置文件
     * @param more 需要执行的额外命令
     * @param bothtools 为true将MASM和TASM都挂载到path中，并删除T.*复制相应文件到此处
     */
    public async openDOSBox(conf:Config,more:string,bothtools?:boolean,diag?:landiagnose) {
        let filename=window.activeTextEditor?.document.fileName
        if (filename){
            if(bothtools) await this.cleanandcopy(conf.path,filename)
            this.writeBoxconfig(more,conf,bothtools).then(
                ()=>{
                    if(process.platform=='win32'){
                        execSync('start/min/wait "" "dosbox/dosbox.exe" -conf "dosbox/VSC-ExtUse.conf" ',{cwd:conf.path,shell:'cmd.exe'})
                    }
                    else{
                        execSync('dosbox -conf "dosbox/VSC-ExtUse.conf" ',{cwd:conf.path})
                    }
                    if(diag) this.BOXdiag(conf,diag)
                    this._OutChannel.appendLine("已打开DOSBox，并配置汇编环境")

                }
            )
            
            
        }   
    }
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
                        this._OutChannel.append(info)
                    }
                )
            },
            ()=>{console.log(infouri,'readfailed')}
        )}
        return info
    }
    private async cleanandcopy(cleanpath:string,copyfilename:string){
        if(process.platform=='win32'){
            let command:string='del/Q work\\t*.* & copy "'+copyfilename+'" work\\T.ASM'
            execSync(command,{cwd:cleanpath,shell:'cmd.exe'});
        }
        else{
            let command:string='if [ -d work ]; then rm work/*; else mkdir work; fi; cp "'+copyfilename+'" work/T.ASM'
            execSync(command,{cwd:cleanpath});
        }
        this._OutChannel.appendLine(copyfilename+'已将该文件复制到'+cleanpath+'work/T.ASM');
     }
    private async writeBoxconfig(autoExec: string,conf:Config,bothtool?:boolean)
    {
        let fs: FileSystem = workspace.fs;
        let configUri=Uri.joinPath(conf.toolsUri,'./dosbox/VSC-ExtUse.conf');
        let workpath=Uri.joinPath(conf.toolsUri,'./work/');
        let Pathadd=' '
        if (bothtool) Pathadd='set PATH=c:\\tasm;c:\\masm'
        const configContent = `[sdl]
windowresolution=${conf.resolution}
output=opengl
[autoexec]
mount c "${conf.path}"
mount d "${workpath.fsPath}"
d:
${Pathadd}
${autoExec}`;
        fs.writeFile(configUri, new TextEncoder().encode(configContent));
    }
}



