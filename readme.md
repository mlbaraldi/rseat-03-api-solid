# App

Gympass Style App.

## RFs (req funcionais) - O que é possível fazer
* [ x ] Deve ser possível se cadastrar como usuário
* [ x ] Deve ser possível se autenticar
* [ x ] Deve ser possível obter o perfil do usuário logado
* [  ] Deve ser possível editar o perfil do usuário logado
* [  ] Deve ser possível obter o número de checkins do usuário logado
* [  ] Deve ser possível o usuário obter histórico de checkins
* [  ] Deve ser possível o usuário buscar academias próximas
* [  ] Deve ser possível o usuário buscar academias pelo nome
* [ x ] Deve ser possível o usuário realizar checkin em uma academia
* [  ] Deve ser possível validar o checkin de um usuário
* [  ] Deve ser possível cadastrar uma academia

## RNs (regras negocios) - Regras que não podem ser violadas
* [ x ] O usuário não pode se cadastrar com email duplicado
* [ x ] O usuário não pode fazer 2 checkins no mesmo dia
* [  ] O usuário não pode fazer checkin se não estiver (100m) próximo da academia
* [  ] O checkin só pode ser validado até 20 min após criado
* [  ] O checkin só pode ser validado pelo admin
* [  ] A academia só pode ser cadastrada por admin

## RNFs (req n funcionais) - Regras sem controles do cliente
* [ x ] A senha do usuário deve ser criptografada
* [ x ] Os dados da aplicação devem estar persistidos em um banco posgresSQL
* [  ] Todas listas de dados precisam estar paginadas com 20 itens por página
* [  ] O usuario deve ser identificado por um JWT