
export default async function handler(req, res) {
  const clientId = process.env.CDEK_CLIENT_ID;
  const clientSecret = process.env.CDEK_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // Получаем токен
    const tokenRes = await fetch("https://api.cdek.ru/v2/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: "Ошибка при получении токена",
        details: tokenData
      });
    }

    // Делаем тестовый запрос (можно поменять на /calculate или другие)
    const apiRes = await fetch("https://api.cdek.ru/v2/location/cities?country_codes=RU&size=1", {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      }
    });

    const apiData = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({
        error: "Ошибка запроса к CDEK API",
        details: apiData
      });
    }

    // Ответ клиенту
    res.status(200).json({
      success: true,
      city: apiData[0]?.city_name ?? "нет данных",
      expires_in: tokenData.expires_in
    });

  } catch (error) {
    res.status(500).json({
      error: "Internal error",
      message: error.message
    });
  }
}
