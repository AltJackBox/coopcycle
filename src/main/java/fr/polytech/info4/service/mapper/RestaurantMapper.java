package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.RestaurantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Restaurant} and its DTO {@link RestaurantDTO}.
 */
@Mapper(componentModel = "spring", uses = { CooperativeMapper.class })
public interface RestaurantMapper extends EntityMapper<RestaurantDTO, Restaurant> {
    @Mapping(target = "cooperative", source = "cooperative", qualifiedByName = "id")
    RestaurantDTO toDto(Restaurant s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RestaurantDTO toDtoId(Restaurant restaurant);
}
