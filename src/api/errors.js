const { REACT_APP_PROD_API_URL } = process.env;

export const postError = async (body) => {
  await fetch(`${REACT_APP_PROD_API_URL}/submitErrorJson`, {
    method: "POST",
    mode: "cors",
    headers: {
      Host: "mapy.radiopolska.pl",
      "Content-Type": "application/json",
      "Content-Length": 122,
    },
    body: JSON.stringify({ app: "mapyrp", ...body }),
  })
    .then((res) => res.text())
    .catch(() => {
      throw "Nieudana próba powiadomienia administracji o problemie.";
    });
};
