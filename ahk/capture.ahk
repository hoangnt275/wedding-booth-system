#NoEnv
#SingleInstance Force
SetTitleMatchMode, 2
SendMode, Input

eosTitle := "EOS R100"

; CLI: capture.ahk shoot
if (A_Args.Length() >= 1 && A_Args[1] = "shoot") {
    Gosub, DoShoot
    ExitApp
}

F8::
    Gosub, DoShoot
return

DoShoot:
    ; Không cho window giành focus
    BlockInput, On

    ; Gửi Space trực tiếp, KHÔNG activate
    ControlSend,, {Space}, %eosTitle%

    ; Phòng trường hợp EOS Utility tự bật lên
    Sleep, 20
    WinMinimize, %eosTitle%

    BlockInput, Off
return

Esc::ExitApp
