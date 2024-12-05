const LabelPreivew: React.FC<{ label: string; avoidOverflowText?: boolean }> = ({
  label,
  avoidOverflowText,
}) => {
  return (
    <div
      className={`custom-preview  ${
        avoidOverflowText ? "text-ellipsis overflow-hidden" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: label }}
    ></div>
  );
};

export default LabelPreivew;
