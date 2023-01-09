import dotenv from 'dotenv'

dotenv.config();

class TableController{
    async searchData(req, res){
        const { cnpj } = req.body;
        const table_id = "302803354";
        try{ 
            const resp = await fetch('https://api.pipefy.com/graphql',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.authorization
                },
                body: JSON.stringify({
                    //"query": `query{table(id:${table_id}) {table_fields{ id label}}}` //Buscar id e nome de cada campo
                    "query": `{table_records (table_id: ${table_id} search: {title:"${cnpj}"}) { edges { node { id record_fields {name value}}}}}`
                })
            });
    
            const data = await resp.json();

            if(data.data.table_records.edges.length == 0){
                res.status(404).json(
                    {data: 'Dados não encontrados'}
                )
            } else {
                res.status(200).json(
                    {data: data.data.table_records.edges[0].node}
                )
            } 
        } catch (err){
            res.status(500).end()
        }
    }

    async createDataTable(req, res){
        const {cnpj, nomeEmpresa, industria, cep, estado, cidade} = req.body;

        //Validando dados
        if(!cnpj || !nomeEmpresa || !industria || !cep || !estado || !cidade){
            res.status(404).json(
                {data: 'Dados Inválidos'}
            )
        }
        
        //Validando quantidade de números do CNPJ
        if(cnpj.length < 13 || cnpj.length > 13){
            res.status(404).json(
                {data: 'CNPJ inválido'}
            )
        }
        const cnpjNumber = parseInt(cnpj);
        const estados = ['Acre', 'Aagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santos', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];
        //Validando estado
        if(estados.includes(estado) == false){
            res.status(404).json(
                {data: 'Estado Inválido'}
            )
        }

        //Validando CEP
        if(cep.length < 1){
            res.status(404).json(
                {data: 'CEP inválido'}
            )
        }
        const cepNumber = parseInt(cep);

        const table_id = "302803354"

        try{ 
            const resp = await fetch('https://api.pipefy.com/graphql',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.authorization
                },
                body: JSON.stringify({
                    "query": `mutation { createTableRecord (input: {table_id:${table_id}  fields_attributes: [
                        {field_id: "cnpj", field_value: "${cnpjNumber}"},
                        {field_id: "nome_da_empresa", field_value: "${nomeEmpresa}"},
                        {field_id: "ind_stria", field_value: "${industria}"}, 
                        {field_id: "cep", field_value: "${cepNumber}"},
                        {field_id: "estado", field_value: "${estado}"},
                        {field_id: "cidade", field_value: "${cidade}"}] 
                        }) 
                      { clientMutationId }}`
                })
            });
    
            const data = await resp.json();
            console.log(data)

            if(data.data.createTableRecord.clientMutationId === null){
                res.status(200).json(
                    {data:'Record criado com sucesso!'}
                )
            } else {
                res.status(400).json(
                    {data: 'Record não criado!'}
                )
            } 
        } catch (err){
            res.status(500).end()
        }
    }

    async createCard(req, res){
        const {resumoOportunidade} = req.body;
        const contato_id = 600215832; //Id do contato na tabela "Contatos"
        const pipe_id = 302873445;
        const phase_id = 317828242;
        const origen_id = "API - WhatsApp";

        try{ 
            const resp = await fetch('https://api.pipefy.com/graphql',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.authorization
                },
                body: JSON.stringify({
                    "query": `mutation{ createCard (input: {pipe_id:${pipe_id}  phase_id:${phase_id}  fields_attributes: [
                        {field_id: "oportunidade", field_value: "${resumoOportunidade}"},
                        {field_id: "origem_da_oportunidade", field_value: "${origen_id}"},
                        {field_id: "contato", field_value: "${contato_id}"}] 
                        }) 
                        { card {id title }}}`
                })
            });
    
            const data = await resp.json();
            console.log(data)

            if(data.data.createCard === null){
                res.status(400).json(
                    {data: 'Card não criado!'}
                )
                
            } else {
                res.status(200).json(
                    {data:'Card criado com sucesso!'}
                )
            } 
        } catch (err){
            res.status(500).end()
        }
    }

}

export default new TableController();