import { getSQLConnection, executeQuery } from "./sql"

export async function addNewQuestion(text: string, askedBy, answerBy: string) {
    const textinquery = text.replaceAll("'", "''");
    const askinquery = askedBy.replaceAll("'", "''");
    const answerinquery = answerBy.replaceAll("'", "''");
    const conn = await getSQLConnection();
    const res = await executeQuery(`insert into q values('${textinquery}', '${askinquery}', '${answerinquery}', 1, getdate()); select @@identity`, conn);
    return res[0][''];
}

export async function likeQuestion(id) {
    const conn = await getSQLConnection();
    await executeQuery(`update q set liked += 1 where id=${id}`, conn);
}

export async function listQuestions() {
    const conn = await getSQLConnection();
    const res = await executeQuery(`select * from q`, conn);
    return res;
}

