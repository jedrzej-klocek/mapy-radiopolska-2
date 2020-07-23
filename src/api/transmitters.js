const { REACT_APP_PROD_API_URL } = process.env;

export const fetchTransmittersBySystem = async (system) => {
  const dataUrl = `${REACT_APP_PROD_API_URL}/transmitterAll/pl/${system}`;

  const response = await fetch(dataUrl)
    .then((res) => res.json())
    .catch((_) => {
      throw `Coś poszło nie tak podczas połączenia z serwerem nadajników dla systemu ${system}.`;
    });

  if (response.success && response.data.length) {
    return response.data || [];
  }
  throw 'Brak połączenia z serwerem nadajników.';
};

export const fetchAPIConfigurations = async (configurationKey) => {
  const dataUrl = `${REACT_APP_PROD_API_URL}/cfg`;

  const response = await fetch(dataUrl)
    .then((res) => res.json())
    .catch((_) => {
      throw 'Coś poszło nie tak podczas połączenia z serwerem konfiguracji map.';
    });

  if (response.success) {
    const configurations = response.data;
    const selectedConfiguration = configurations.filter(
      (configuration) => configuration.cfg === configurationKey
    );

    return { selectedConfiguration, configurations };
  }
  throw 'Brak połączenia z serwerem konfiguracji map.';
};

const fetchTransmitterById = async (url) => {
  const response = await fetch(url)
    .then((res) => res.json())
    .catch((_) => {
      throw Error(
        'Coś poszło nie tak podczas połączenia z serwerem nadajnika.'
      );
    });

  if (response.success && response.data.length) {
    return response.data[0] || undefined;
  }
  if (!response.success) {
    throw Error(response.err_msg);
  }
  throw Error('Brak nadajnika o podanym id w bazie danych');
};

export const fetchTransmittersArray = async (ids, system) => {
  const requests = ids.map((id) => {
    const url = `${REACT_APP_PROD_API_URL}/transmitterById/pl/${system}/${id}`;

    return fetchTransmitterById(url)
      .then((transmitter) => transmitter)
      .catch((e) => {
        console.error(e);
      });
  });

  return Promise.all(requests);
};
