import { isNeurosiftResponse, NeurosiftRequest, NeurosiftRequestPayload, NeurosiftResponse } from "../types/NeurosiftRequest";

const postNeurosiftRequest = async (req: NeurosiftRequestPayload, o: {userId?: string, githubAccessToken?: string}): Promise<NeurosiftResponse> => {
    const rr: NeurosiftRequest = {
        payload: req
    }
    if ((o.userId) && (o.githubAccessToken)) {
        rr.githubAccessToken = o.githubAccessToken
        rr.userId = o.userId
    }
    const resp = await fetch('/api/neurosift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rr),
    })
    const responseText = await resp.text()
    let responseData: any
    try {
        responseData = JSON.parse(responseText)
    } catch (e) {
        console.error(responseText)
        throw Error('Problem parsing neurosift response')
    }
    if (!isNeurosiftResponse(responseData)) {
        console.warn(JSON.stringify(responseData, null, 2))
        throw Error('Unexpected neurosift response')
    }
    return responseData
}

export default postNeurosiftRequest