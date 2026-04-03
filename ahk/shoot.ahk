#NoEnv
#SingleInstance Force
SetTitleMatchMode, 2
SendMode, Input

; ====== CONFIG ======
eosTitle := "EOS R100"
; ====================

F8::
    ; Activate EOS Utility
    WinActivate, %eosTitle%
    WinWaitActive, %eosTitle%,, 2
    Sleep, 80

    ; Chụp
    Send, {Space}

    ; Giấu cửa sổ ngay sau khi chụp
    Sleep, 30
    WinMinimize, %eosTitle%
return

Esc::ExitApp
