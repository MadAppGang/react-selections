import PropTypes from 'prop-types';
import CSSClassBuilder from 'css-class-combiner';
import AbstractSelection from './AbstractSelection';

class StyledSelection extends AbstractSelection {
  componentWillReceiveProps(nextProps) {
    this.setState({ area: nextProps.area });
  }

  getClassName() {
    const { isHovered, isFocused } = this.state;
    const { className, hoverClassName, focusClassName } = this.props;

    return new CSSClassBuilder('mr-selection')
      .combine(className)
      .combineIf(isHovered, hoverClassName)
      .combineIf(isFocused, focusClassName);
  }

  getStyles() {
    return {
      ...this.props.style,
      ...this.getPositionStyles(),
    };
  }
}

StyledSelection.propTypes = {
  hoverClassName: PropTypes.string,
  focusClassName: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

StyledSelection.defaultProps = {
  hoverClassName: '',
  focusClassName: '',
  className: '',
  style: {},
};

export default StyledSelection;
