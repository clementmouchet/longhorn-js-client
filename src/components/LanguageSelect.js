import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';
import $ from 'jquery'

export default class LanguageSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      okapiLanguages: [],
    };
  };

  componentDidMount() {
    this.fetchOkapiLanguages();
  }

  fetchOkapiLanguages() {
    console.debug('fetchOkapiLanguages', this.state.okapiLanguages);
    let self = this;
    fetch(`${process.env.PUBLIC_URL}/languages.json`)
      .then(response => response.json())
      .then((response) => {
        console.debug('okapiLanguages', response);
        self.setState({
          okapiLanguages: response,
        });
      })
      .catch((err) => {
        console.error('fetchOkapiLanguages', err)
      });
  }

  static formatLocaleResult(locale) {
    // Leave Placeholder alone
    if (!locale.text) {
      return locale.text;
    }
    return $(
      `<span>${locale.text}&nbsp;<strong class="pull-right pad-right">${locale.id}</strong></span>`
    );
  }

  static formatLocaleSelection(locale) {
    // Leave Placeholder alone
    if (!locale.text) {
      return locale.text;
    }
    return $(
      `<span>${locale.text}&nbsp;<strong>${locale.id}</strong></span>`
    );
  }

  static select2matcher(params, data) {
    // If there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
      return data;
    }

    if (String((data.text).toUpperCase()).startsWith((params.term).toUpperCase())) {
      return data;
    } else if (String((data.id).toUpperCase()).startsWith((params.term).toUpperCase())) {
      return data;
    } else {
      return null;
    }
  }

  render() {
    return (
      <Select2
        ref={this.props.inputRef}
        data={this.state.okapiLanguages}
        multiple={this.props.multiple}
        options={{
          theme: 'bootstrap',
          placeholder: 'Source Language',
          templateResult: LanguageSelect.formatLocaleResult,
          templateSelection: LanguageSelect.formatLocaleSelection,
          matcher: LanguageSelect.select2matcher,
          width: '100%'
        }}
      />
    );
  }

}