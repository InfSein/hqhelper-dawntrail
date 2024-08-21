!macro customHeader
  ; Set the installer title to productName only, no version
  !define MUI_TEXT_WELCOME_TITLE "$(^Name)"
  !define MUI_TEXT_WELCOME_INFO_TEXT "Welcome to the $(^Name) Setup Wizard"
!macroend

!macro preInit
  ; Use this macro to perform actions before the installer GUI is initialized
!macroend
